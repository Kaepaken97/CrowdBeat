import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SongItem} from '../../../../models/songItem';
import config from '../../../../config';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';
import { ActivatedRoute } from '@angular/router';
import {Event} from 'src/app/models/event';

@Component({
  selector: 'song-item-playlist-user',
  templateUrl: './song-item-playlist-user.component.html',
  styleUrls: ['../song-item.component.scss']
})
export class SongItemPlaylistUserComponent implements OnInit {
  @Input() playlistId: string = "";
  @Input() item: SongItem = new SongItem();
  @Input() isVoted: boolean = false;
  eventCode: string = "";
  userCookie: string = "";
  event: Event = new Event();

  @Output() refreshParent = new EventEmitter<string>();
  constructor(
    private route: ActivatedRoute,
    private userService: UserService, 
    private eventService: EventService) { }

  ngOnInit(): void {
    var tempCode = this.route.snapshot.paramMap.get("eventCode");
    this.eventCode = tempCode ? tempCode : "";
    var tempCookie = this.route.snapshot.paramMap.get("userCookie");
    this.userCookie = tempCookie ? tempCookie : "";
    if(this.eventCode != "") {
      this.eventService.getEventByEventCode(this.eventCode).subscribe(x => {
        this.event = x;
      });
    }
  }

  vote() {
    this.isVoted = !this.isVoted;
    var self = this;
    if(this.isVoted)
    {
      this.eventService.getAllVotedBy(this.eventCode, this.userCookie).subscribe(x => {
        console.log(this.item);
        if(x.length < this.event.voteLimit)
          this.userService.voteTrack(this.eventCode, this.userCookie, this.item.trackURI).subscribe(x => {});
        else{
          this.isVoted = false;
          alert("You can't upvote any more tracks");
        }
      });
    }
  else{
    this.userService.unvoteTrack(this.eventCode, this.userCookie, this.item.trackURI).subscribe(x => {});
  }
}
}
