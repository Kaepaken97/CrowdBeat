import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Playlist } from 'src/app/models/playlist';
import { EventModal } from '../../shared/event-modal/event-modal.component';

@Component({
  selector: 'new-playlist-card',
  templateUrl: './new-playlist-card.component.html',
  styleUrls: ['./new-playlist-card.component.scss']
})
export class NewPlaylistCardComponent implements OnInit {
@Input() playlist: Playlist = new Playlist();
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onHost(): void {
    //open eventmodal
    const dialogRef = this.dialog.open(EventModal, {
      width: '500px',
    });

    //use new playlist id
    dialogRef.componentInstance.playlistID = "";
    //use event name for playlist name
    dialogRef.componentInstance.playlistName = "";

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result != undefined) {
        //this.playButton = false;
      }
    });
  }
}
