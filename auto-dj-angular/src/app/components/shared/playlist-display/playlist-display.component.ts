import { Component, OnInit, Input, Directive, Output, EventEmitter } from '@angular/core';
import { Playlist } from '../../../models/playlist';
import {SongItem} from "../../../models/songItem";
import { HttpClient } from '@angular/common/http';
import config from '../../../config';
import { PlaylistService } from 'src/app/services/playlist.service';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlist-display',
  templateUrl: './playlist-display.component.html',
  styleUrls: ['./playlist-display.component.scss'],
})
export class PlaylistDisplayComponent implements OnInit {
  @Input() eventCode: string = "";
  @Input() playlist: Playlist = new Playlist();
  @Input() type: string = "participant";
  userCookie: string = "";
  votedBySelf: any[] = [];
  votesInterval: any = null;
  intervalDuration: number = 5000;

  @Output() refreshParent = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute, 
    private playlistService: PlaylistService,
    private eventService: EventService) { }

  ngOnInit(): void {
    if(this.type == "participant") {
      var tempCookie = this.route.snapshot.paramMap.get("userCookie");
      this.userCookie = tempCookie ? tempCookie : "";
      this.getAllVotedByCurrentUser();
      this.votesInterval = setInterval(this.getAllVotedByCurrentUser.bind(this), this.intervalDuration);
    }
  }

  refresh() {
    this.refreshParent.emit();
  }

  getAllVotedByCurrentUser() {
    var self = this;
    this.eventService.getAllVotedBy(this.eventCode, this.userCookie).subscribe(x => {
      self.votedBySelf = x;
      console.log(x);
    });
  }

  isVotedBySelf(uri: string): boolean {
    return this.votedBySelf.filter((x:any) => x.trackURI == uri).length > 0;
  }
}
