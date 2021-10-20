import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Playlist } from 'src/app/models/playlist';
import { PlaylistService } from 'src/app/services/playlist.service';
import { EventModal } from '../../shared/event-modal/event-modal.component';

@Component({
  selector: 'playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.scss']
})
export class PlaylistCardComponent implements OnInit {

  @Input() playlist: Playlist = new Playlist();
  @Input() doesPlaylistHaveEvent: boolean = false;
  buttonText: string = "Copy This Playlist";

  constructor(public dialog: MatDialog,
    private playlistService: PlaylistService) { }

  ngOnInit(): void {
    console.log(this.playlist.name, this.doesPlaylistHaveEvent);
    this.buttonText = this.doesPlaylistHaveEvent ? "Open Existing Event" : "Copy This Playlist";
  }

  onHost(): void {
    //TODO auto go to admin-portal on doesPlaylistHaveEvent == true
    const dialogRef = this.dialog.open(EventModal, {
      width: '500px',
    });

    dialogRef.componentInstance.playlistID = this.playlist.id;
    dialogRef.componentInstance.playlistName = this.playlist.name;
    dialogRef.componentInstance.doesPlaylistHaveEvent = this.doesPlaylistHaveEvent;

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if(result != undefined) {
        //this.playButton = false;
      }
    });
  }
}
