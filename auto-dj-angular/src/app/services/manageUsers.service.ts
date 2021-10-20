import config from '../config';
import { Playlist } from '../models/playlist';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SongItem } from '../models/songItem';
import { Participant } from '../models/participant';
@Injectable()
export class ManageUsersService {
    constructor(private http: HttpClient) { }
    banParticipant(eventCode: string, participant: Participant) {
        var url = config.baseAPIUrl + "/host/updateParticipant/" + participant.userCookie + "/" + participant.displayName + "/" + "1";
        this.http.get(url).subscribe((x: any) => {});;
    }
    unbanUser(eventCode: string, participant: Participant) {
        var url = config.baseAPIUrl + "/host/updateParticipant/" + participant.userCookie + "/" + participant.displayName + "/" + "1";
        this.http.get(url).subscribe((x: any) => {});;
    }
    getAllUsers(eventCode: string) {
        var url = config.baseAPIUrl + "/host/getAllEventParticipants/" + eventCode;
        this.http.get<Participant[]>(url).subscribe((x: any) => {});;
    }
}