import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SongItem} from '../../../../models/songItem';
import config from '../../../../config';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import {Event} from 'src/app/models/event';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'song-item-search-user',
  templateUrl: './song-item-search-user.component.html',
  styleUrls: ['../song-item.component.scss']
})
export class SongItemSearchUserComponent implements OnInit {
  @Input() playlistId: string = "";
  @Input() item: SongItem = new SongItem();
  eventCode: string = "";
  userCookie: string = "";
  event: Event = new Event();

  @Output() refreshParent = new EventEmitter<string>();
  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private eventService: EventService) { }

  ngOnInit(): void {
    var tempCookie = this.route.snapshot.paramMap.get("userCookie");
    this.userCookie = tempCookie ? tempCookie : "";
    var tempCode = this.route.snapshot.paramMap.get("eventCode");
    this.eventCode = tempCode ? tempCode : "";
    if(this.eventCode != "") {
      this.eventService.getEventByEventCode(this.eventCode).subscribe(x => {
        this.event = x;
      });
    }
  }
  add() {
    this.userService.addTrack(this.eventCode, this.userCookie, this.item.trackURI).subscribe(x => {});
  }
}
