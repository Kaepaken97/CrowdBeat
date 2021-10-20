import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SongItem} from '../../../../models/songItem';
import config from '../../../../config';
import { AdminService } from 'src/app/services/admin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'song-item-playlist-admin',
  templateUrl: './song-item-playlist-admin.component.html',
  styleUrls: ['../song-item.component.scss']
})
export class SongItemPlaylistAdminComponent implements OnInit {
  @Input() playlistId: string = "";
  @Input() item: SongItem = new SongItem();
  @Input() mode: string = ""; //default is playlist
  eventCode: string = "";

  @Output() refreshParent = new EventEmitter<string>();
  constructor(private route: ActivatedRoute, 
    private hostService: AdminService) { }

  ngOnInit(): void {
    var code = this.route.snapshot.paramMap.get("eventCode");
    this.eventCode = code ? code : "";
  }
  ban() {
    this.hostService.banTrack(this.eventCode, this.item.title, this.item.trackURI).subscribe(x=>{
      this.refreshParent.emit();
    });
  }
  unban() {
    this.hostService.unbanTrack(this.eventCode, this.item.title, this.item.trackURI).subscribe(x=>{
      this.refreshParent.emit();
    });
  }
  add() {
    this.hostService.addTrack(this.eventCode, this.playlistId, this.item.trackURI).subscribe(x=>{
      this.refreshParent.emit();
    });
  }
  forceToTop() {
    this.hostService.forceSongToTop(this.eventCode, this.playlistId, this.item.trackURI).subscribe(x=>{
      this.refreshParent.emit();
    });
  }
  remove() {
    this.hostService.removeTrack(this.eventCode, this.playlistId, this.item.trackURI).subscribe(x=>{
      this.refreshParent.emit();
    });
  }
}
