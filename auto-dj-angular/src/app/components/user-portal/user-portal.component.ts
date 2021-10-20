import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import config from '../../config';
import { SongItem } from '../../models/songItem';
import { Playlist } from '../../models/playlist';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { PlaylistDisplayComponent } from '../shared/playlist-display/playlist-display.component';
import { PlaylistService } from 'src/app/services/playlist.service';
import { MediaPlayerService } from 'src/app/services/mediaplayer.service';
import { MatDialog } from '@angular/material/dialog';
import { HelpModal } from '../shared/help-modal/help-modal.component';
import { EventService } from 'src/app/services/event.service';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.scss']
})
export class UserPortalComponent implements OnInit {
  eventCode: string = "";
  id: string|null = "";
  eventTitle: string = "";
  playlist: Playlist = new Playlist();
  trackInterval: any = null;
  trackDuration: number = 5000;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private eventService: EventService,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getEvent();
    this.trackInterval = setInterval(this.getTracks.bind(this), this.trackDuration);
  }

  getEvent() {
    var tempCode = this.route.snapshot.paramMap.get("eventCode");
    this.eventCode = tempCode ? tempCode : "";
    
    var self = this;
    this.eventService.getEventByEventCode(this.eventCode).subscribe(x => {
      self.playlist.id = x.playlistID;
      self.eventTitle = x.eventName;
      self.getPlaylist();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.trackInterval);
  }

  getPlaylist(){
    var self = this;
    if(this.playlist.id != "")
    {
      this.playlistService.getPlaylistById(this.playlist.id).subscribe(x => {
        self.playlist = x;
        self.getTracks();
      });
    }
  }

  getTracks() {
    var self = this;
    if(this.eventCode && this.playlist && this.playlist.id != "") {
      this.playlistService.getTracksFromPlaylist(this.eventCode, this.playlist.id).subscribe(y => {
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
        console.log(this.playlist.songs);
      });
    }
  }

  refresh() {
    console.log("refreshing...")
    this.getTracks();
  }

  helpModal(): void {
    const dialogRef = this.dialog.open(HelpModal, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if(result != undefined) {
        //this.playButton = false;
      }
    });
  }
}
