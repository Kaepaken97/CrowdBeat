import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SongItem} from '../../../../models/songItem';
import config from '../../../../config';
import { PlaylistService } from 'src/app/services/playlist.service';
import { AdminService } from 'src/app/services/admin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'song-item-search-admin',
  templateUrl: './song-item-search-admin.component.html',
  styleUrls: ['../song-item.component.scss']
})
export class SongItemSearchAdminComponent implements OnInit {
  @Input() playlistId: string = "";
  @Input() item: SongItem = new SongItem();
  eventCode: string = "";

  @Output() refreshParent = new EventEmitter<string>();
  constructor(private route: ActivatedRoute, private hostService: AdminService) { }

  ngOnInit(): void {
    var code = this.route.snapshot.paramMap.get("eventCode");
    this.eventCode = code ? code : "";
  }
  ban() {
    console.log(this.item);
    this.hostService.banTrack(this.eventCode, this.playlistId, this.item.trackURI).subscribe(x=>{this.refreshParent.emit();})
  }
  unban() {
    this.hostService.unbanTrack(this.eventCode, this.playlistId, this.item.trackURI).subscribe(x=>{})
  }
  add() {
    this.hostService.addTrack(this.eventCode, this.playlistId, this.item.trackURI).subscribe(x=>{this.refreshParent.emit();})
  }
}
