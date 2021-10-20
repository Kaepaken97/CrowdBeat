import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { NoPlayListService } from 'src/app/services/noPlayList.service';

@Component({
    selector: 'no-play-list-modal',
    templateUrl: 'no-play-list-modal.component.html',
  })
  export class NoPlayListModal {
    constructor(
      public dialogRef: MatDialogRef<NoPlayListModal>,
      private noPlayListService: NoPlayListService) {}

      public eventCode: string = "";
      
    ngOnInit(): void {
    }
 

    onNoClick(): void {
      this.dialogRef.close();
    }

  }