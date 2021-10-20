import config from '../config';
import { Playlist } from '../models/playlist';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SongItem } from '../models/songItem';
@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }
    addParticipant(eventCode: string, displayName: string) {
        var url = config.baseAPIUrl + "/participant/addParticipant/" + eventCode + "/" + displayName;
        return this.http.get(url);
    }

    updateParticipant(userCookie: string, displayName: string) {
        var url = config.baseAPIUrl + "/participant/updateParticipant/" + userCookie + "/" + displayName;
        return this.http.get(url);
    }

    deleteParticipant(userCookie: string) {
        var url = config.baseAPIUrl + "/participant/deleteParticipant/" + userCookie;
        return this.http.get(url);
    }

    unvoteTrack(eventCode: string, userCookie: string, trackUri: string) {
        var url = config.baseAPIUrl + "/participant/unvoteTrack/" + eventCode + "/" + userCookie + "/" + trackUri;
        return this.http.get<any>(url);
    }

    voteTrack(eventCode: string, userCookie: string, trackUri: string) {
        var url = config.baseAPIUrl + "/participant/voteTrack/" + eventCode + "/" + userCookie + "/" + trackUri + "/" + 0;
        return this.http.get<any>(url);
    }

    addTrack(eventCode: string, userCookie: string, trackUri: string) {
        var url = config.baseAPIUrl + "/participant/voteTrack/" + eventCode + "/" + userCookie + "/" + trackUri + "/" + 1;
        return this.http.get(url);
    }
}