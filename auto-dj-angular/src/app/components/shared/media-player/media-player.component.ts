import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MediaPlayerService } from 'src/app/services/mediaplayer.service';
import {MatDialog} from '@angular/material/dialog';
import { DeviceSelector } from './device-selector.component';
import { SongItem } from 'src/app/models/songItem';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit {

  @Input() activePlaylistID: string = "";
  @Input() currentlyPlayingTrack: any = {};
  @Output() updateTrack = new EventEmitter<string>();  
  playButton: boolean = true;
  firstPlayPush: boolean = true;

  constructor(private mediaPlayerService: MediaPlayerService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeviceSelector, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if(result != undefined) {
        this.playButton = false;
      }
    });
  }

  play(): void {
    if(this.firstPlayPush)
    {
      this.mediaPlayerService.play(this.activePlaylistID).subscribe(x=> {
        this.playButton = !this.playButton;
        this.firstPlayPush = false;
        this.updateTrack.emit("play");
      });
    }
    else
      this.mediaPlayerService.play().subscribe(x=> {
        this.playButton = !this.playButton;
        this.updateTrack.emit("play");
      });
  }

  pause(): void {
    this.mediaPlayerService.pause().subscribe(x=> {
      this.playButton = !this.playButton;
      this.updateTrack.emit("pause");
    });
  }

  nextTrack(): void {
    this.mediaPlayerService.nextTrack().subscribe(x=> this.updateTrack.emit("skip") );
  }

  previousTrack(): void {
    this.mediaPlayerService.previousTrack().subscribe(x=> this.updateTrack.emit("skip") );
  }

  updateVolume(event: any): void {
    var volume = event.value;
    this.mediaPlayerService.updateVolume(volume).subscribe(x=>{});
  }
}