import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { EventService } from 'src/app/services/event.service';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
    selector: 'event-modal',
    templateUrl: 'event-modal.component.html',
  })
  export class EventModal {
    constructor(
      public dialogRef: MatDialogRef<EventModal>,
      private adminService: AdminService,
      private eventService: EventService,
      private router: Router,
      private playlistService: PlaylistService) {}

      public playlistID: string = "";
      public eventCode: string = "";
      public doesPlaylistHaveEvent: boolean = false;
      public host: boolean = true;
      public eventName: string = "";
      public voteLimit: string = "";
      public trackLimit: string = "";
      public participantLimit: string = "";
      public playlistName: string = "";
      validateParticipantLimit: boolean = false;
      validateVoteLimit: boolean = false;
      validateTrackLimit: boolean = false;

    async ngOnInit() {
      if(this.playlistID == "" && this.playlistName == "") {
        this.playlistName = "Create a New Playlist";
      }
      if(this.doesPlaylistHaveEvent) {
        this.eventService.getEventByPlaylist(this.playlistID).subscribe(x => {
          this.eventName = x.eventName;
          this.eventCode = x.eventCode;
          this.voteLimit = "" + x.voteLimit;
          this.trackLimit = "" + x.trackLimit;
          this.participantLimit = "" + x.participantLimit;
        })
      }
    }
 
    onNoClick(): void {
      this.dialogRef.close();
    }

    validateParams() {
      var regex = /^[0-9]+$/;
      this.validateParticipantLimit = regex.test(this.participantLimit);
      this.validateVoteLimit = regex.test(this.voteLimit);
      this.validateTrackLimit = regex.test(this.trackLimit);
    }

    async updateEvent() {
      this.validateParams();
      if(this.validateParticipantLimit && this.validateVoteLimit && this.validateTrackLimit && this.eventName != "") {
        var vote = parseInt(this.voteLimit);
        var track = parseInt(this.trackLimit);
        var participant = parseInt(this.participantLimit);
        await this.adminService.updateEvent(this.eventCode, this.eventName, vote, track, participant);
        this.dialogRef.close();
      }
    }

    //TODO differentiate between playlistID and copyThisPlaylistID
    async navigateToHost() {
      this.validateParams();
      if(this.validateParticipantLimit && this.validateVoteLimit && this.validateTrackLimit && this.eventName != "") {
        if(this.doesPlaylistHaveEvent) {
          this.eventService.resetCurrentlyPlaying(this.eventCode).subscribe(x => {});
          this.router.navigate(["/admin-portal/", this.eventCode]);
          this.dialogRef.close();
        }
        else {
          var self = this;
          var copyThisPlaylistID = this.playlistID;
          await this.playlistService.createPlaylist(this.eventName).subscribe(async (x:any) => {
            self.playlistID = x;
            console.log(x);
            if(copyThisPlaylistID != "") {
              this.playlistService.copyPlaylist(copyThisPlaylistID, self.playlistID).subscribe(async (x:any) => {
                setTimeout(await this.createEvent.bind(this), 1000);
              }, (error: any) => self.playlistID = "");
            }
            else
              await this.createEvent();
          }, (error: any) => self.playlistID = "");
        }
      }
    }

    async createEvent() {
      var self = this;
      var vote = parseInt(this.voteLimit);
      var track = parseInt(this.trackLimit);
      var participant = parseInt(this.participantLimit);
      await this.adminService.createEvent(this.playlistID, this.eventName, vote, track, participant).subscribe((x:any) => {
        //switch this to use eventcode not playlistid
        self.router.navigate(["/admin-portal/", x]);
        self.dialogRef.close();
      });
    }
  }