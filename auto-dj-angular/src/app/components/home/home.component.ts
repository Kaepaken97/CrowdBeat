import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';
import config from 'src/app/config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  eventCode: string = "";
  displayName: string = "";
  isEventCodeValid: boolean = false;
  isDisplayNameValid: boolean = false;
  constructor(
    private userService: UserService, 
    private eventService: EventService,
    private router: Router) { }

  ngOnInit(): void {
  }

  hostLogin() {
    window.location.replace(config.baseAPIUrl + "/login");
  }

  validateEventCode() {
    if(this.eventCode != "")
      {
        var event = null;
        this.eventService.getEventByEventCode(this.eventCode).subscribe(x => event = x);
        if(event != null)
          this.isEventCodeValid = true;
        else
          this.isEventCodeValid = false;
      }
    else
      this.isEventCodeValid = false;
  }

  validateDisplayName() {
    if(this.displayName == "" || this.displayName.length < 5)
      this.isDisplayNameValid = true;
    else 
      this.isDisplayNameValid = false;
  }

  start() {
    this.validateEventCode();
    this.validateDisplayName();
    if(!this.isEventCodeValid && !this.isDisplayNameValid)
    {
      this.userService.addParticipant(this.eventCode, this.displayName).subscribe(x => {
        //this.userCookieService.setCookie(x.toString());
        this.router.navigate(["/user-portal/" + this.eventCode + "/" + x.toString()]);
      });
    }
  }

  getAutoDJToken() {
    window.location.replace("http://localhost:8080/autoDJLogin");
  }
}
