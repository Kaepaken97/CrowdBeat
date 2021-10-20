import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { MediaPlayerService } from 'src/app/services/mediaplayer.service';
@Component({
    selector: 'device-selector',
    templateUrl: 'device-selector.component.html',
  })
  export class DeviceSelector {
  
    data: any = [];

    constructor(
      public dialogRef: MatDialogRef<DeviceSelector>,
      private mediaPlayerService: MediaPlayerService,) {}

      ngOnInit(): void {
        this.getDevices();
      }
  
      getDevices(): any {
        this.mediaPlayerService.getDevices().subscribe(x => {
          console.log(x);
          this.data = x;
        });
      }

    onNoClick(): void {
      this.dialogRef.close();
    }
  
    onDeviceSelected(device: any): void {
      console.log(device);
      this.mediaPlayerService.transferPlayback(device.id).subscribe(x=> {
        console.log();
      });
      this.mediaPlayerService.updateVolume(device.volume_percent).subscribe(x=> {
        console.log();
      });
      this.dialogRef.close(device.id);
    }
  }