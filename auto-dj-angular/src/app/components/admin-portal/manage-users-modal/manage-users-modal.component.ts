import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { ManageUsersService } from 'src/app/services/manageUsers.service';

@Component({
    selector: 'manage-users-modal',
    templateUrl: 'manage-users-modal.component.html',
  })
  export class ManageUsersModal {
  
    data: any = [];

    constructor(
      public dialogRef: MatDialogRef<ManageUsersModal>,
      private manageUsersService: ManageUsersService) {}

      public eventCode: string = "";
      
    ngOnInit(): void {
    }
 

    onNoClick(): void {
      this.dialogRef.close();
    }

  }