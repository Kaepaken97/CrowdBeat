import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  HttpClient
} from '@angular/common/http';
import config from '../../config';
import {
  SongItem
} from '../../models/songItem';
import {
  Playlist
} from '../../models/playlist';
import {
  i18nMetaToJSDoc
} from '@angular/compiler/src/render3/view/i18n/meta';
import {
  PlaylistDisplayComponent
} from '../shared/playlist-display/playlist-display.component';
import {
  PlaylistService
} from 'src/app/services/playlist.service';
import {
  MediaPlayerService
} from 'src/app/services/mediaplayer.service';
import {
  MatDialog
} from '@angular/material/dialog';
import {
  HelpModal
} from '../shared/help-modal/help-modal.component';
import {
  EventModal as SettingsModal
} from '../shared/event-modal/event-modal.component';
import {
  NoPlayListModal
} from './no-play-list-modal/no-play-list-modal.component';
import {
  ManageUsersModal
} from './manage-users-modal/manage-users-modal.component';
import {
  EventService
} from 'src/app/services/event.service';
import {
  Event
} from 'src/app/models/event';


@Component({
  selector: 'admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.scss']
})
export class AdminPortalComponent implements OnInit {
  playlist: Playlist = new Playlist();
  event: Event = new Event();
  currentlyPlayingTrack: SongItem = new SongItem();
  currentlyPlayingInterval: any = null;
  addUnaddedTracksInterval: any = null;
  intervalDuration: number = 5000;

  @ViewChild(PlaylistDisplayComponent)
  playlistDisplayComponent!: PlaylistDisplayComponent;

  constructor(
    private route: ActivatedRoute,
    private mediaPlayerService: MediaPlayerService,
    private playlistService: PlaylistService,
    private eventService: EventService,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    var code = this.route.snapshot.paramMap.get("eventCode");
    this.event.eventCode = code ? code : "";
    this.getEvent();
    this.getCurrentlyPlayingTrack();
    this.currentlyPlayingInterval = setTimeout(this.getCurrentlyPlayingTrack.bind(this), this.intervalDuration);
    this.addUnaddedTracksInterval = setInterval(this.addAllUnaddedTracks.bind(this), this.intervalDuration);
  }

  addAllUnaddedTracks() {
    //console.log(this.event);
    if(this.event.eventCode != "" && this.event.playlistID != "")
      this.eventService.addAllUnaddedTracks(this.event.eventCode, this.event.playlistID).subscribe(x => {this.getTracks()});
  }

  getCurrentlyPlayingTrack(): any {
    if (this.playlist.songs.length > 0) {
      this.mediaPlayerService.getCurrentlyPlayingTrack(this.event.eventCode).subscribe((x: any) => {
        this.currentlyPlayingTrack = x;
        this.intervalDuration = x.durationMS - x.progressMS;
        this.getTracks();
        if (x.isPlaying) {
          this.currentlyPlayingInterval = setTimeout(this.getCurrentlyPlayingTrack.bind(this), this.intervalDuration);
        }
      });
    }
  }

  updateCurrentlyPlayingTrack(event: string) {
    if (this.playlist.songs.length > 0) {
      setTimeout(this.getCurrentlyPlayingTrack.bind(this), 1000);
      //setTimeout(this.playlistDisplayComponent.updateCurrentQueue.bind(this.playlistDisplayComponent), 1500);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.currentlyPlayingInterval);
  }

  getEvent() {
    var self = this;
    if (this.event.eventCode != "") {
      this.eventService.getEventByEventCode(this.event.eventCode).subscribe((x: Event) => {
        if (x != null)
          self.event = x;
          self.getPlaylist();
      });
    }
  }

  getPlaylist() {
    var self = this;
    this.playlistService.getPlaylistById(self.event.playlistID).subscribe(x => {
      self.playlist = x;
      self.getTracks();
    });
  }

  getTracks() {
    var self = this;
    this.playlistService.getTracksFromPlaylist(self.event.eventCode, self.playlist.id).subscribe(y => {
      var currentlyPlayingIndex = -1;
      for(var i = 0; i < y.length; i++) {
        if(y[i].isCurrentlyPlaying) {
          currentlyPlayingIndex = i;
          i = y.length;
        }
      }
      if(currentlyPlayingIndex == -1)
        self.playlist.songs = y;
      else
        self.playlist.songs = y.slice(currentlyPlayingIndex);
    });
  }

  refresh() {
    //console.log("refreshing tracks");
    this.getTracks();
  }

  resetCurrentlyPlayingTrack() {
    this.eventService.resetCurrentlyPlaying(this.event.eventCode).subscribe(x => {});
  }

  helpModal(): void {
    const dialogRef = this.dialog.open(HelpModal, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result != undefined) {
        //this.playButton = false;
      }
    });
  }

  settingsModal(): void {
    const dialogRef = this.dialog.open(SettingsModal, {
      width: '500px',
    });

    dialogRef.componentInstance.eventCode = this.event.eventCode;
    dialogRef.componentInstance.eventName = this.event.eventName;
    dialogRef.componentInstance.participantLimit = "" + this.event.participantLimit;
    dialogRef.componentInstance.playlistID = this.event.playlistID;
    dialogRef.componentInstance.voteLimit = "" + this.event.voteLimit;
    dialogRef.componentInstance.trackLimit = "" + this.event.trackLimit;

    dialogRef.componentInstance.host = false;
    dialogRef.componentInstance.playlistName = this.playlist.name;

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result != undefined) {
        //this.playButton = false;
      }
    });
  }

  noPlayListModal(): void {
    const dialogRef = this.dialog.open(NoPlayListModal, {
      width: '500px',
    });

    dialogRef.componentInstance.eventCode = this.event.eventCode;

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result != undefined) {
        //this.playButton = false;
      }
    });
  }

  manageUsersModal(): void {
    const dialogRef = this.dialog.open(ManageUsersModal, {
      width: '500px',
    });

    dialogRef.componentInstance.eventCode = this.event.eventCode;

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result != undefined) {
        //this.playButton = false;
      }
    });
  }
}
