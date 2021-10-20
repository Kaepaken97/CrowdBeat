import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { AdminService } from 'src/app/services/admin.service';

@Component({
    selector: 'settings-modal',
    templateUrl: 'settings-modal.component.html',
  })
  export class SettingsModal {
    constructor(
      public dialogRef: MatDialogRef<SettingsModal>,
      private adminService: AdminService) {}
      public eventCode: string = "";

    ngOnInit(): void {
      //this.adminService.updateEvent(this.eventCode, "Name", 0, 0, 0);
    }
 
    onNoClick(): void {
      this.dialogRef.close();
    }
  }