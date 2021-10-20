import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'help-modal',
    templateUrl: 'help-modal.component.html',
  })
  export class HelpModal {
    constructor(
      public dialogRef: MatDialogRef<HelpModal>) {}

    ngOnInit(): void {
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
  }