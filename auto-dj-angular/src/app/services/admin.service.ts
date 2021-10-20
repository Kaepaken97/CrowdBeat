import config from '../config';
import { Playlist } from '../models/playlist';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SongItem } from '../models/songItem';
@Injectable()
export class AdminService {
    constructor(private http: HttpClient) { }
    getActiveHost() {
        var url = config.baseAPIUrl + '/host/getActiveHost';
        return this.http.get<any>(url);
    }
    createEvent(playlistID: string, eventName: string, voteLimit: number, trackLimit: number, participantLimit: number) {
        var url = config.baseAPIUrl + "/host/createEvent/" + playlistID + "/" + eventName + "/" + 
            voteLimit + "/" + trackLimit + "/" + participantLimit;
            console.log(encodeURI(url));
        return this.http.get(encodeURI(url));
    }
    updateEvent(eventCode: string, eventName: string, voteLimit: number, trackLimit: number, participantLimit: number) {
        var url = config.baseAPIUrl + "/host/updateEvent/" + eventCode + "/" + eventName + "/" + 
        voteLimit + "/" + trackLimit + "/" + participantLimit;
        console.log(url);
        return this.http.get(url);
    }
    deleteEvent(eventCode: string) {
        var url = config.baseAPIUrl + '/event/deleteEvent/' + eventCode;
        return this.http.get(url);
    }
    forceSongToTop(eventCode: string, playlistID: string, trackURI: string) {
        var url = config.baseAPIUrl + '/eventTracks/forceToTop/' + eventCode + "/" + playlistID + "/" + trackURI;
        return this.http.get(url);
    }
    addTrack(eventCode: string, playlistID: string, trackURI: string) {
        var url = config.baseAPIUrl + "/host/queueAdd/" + playlistID + "/" + trackURI;
        return this.http.get(url);
      }
    removeTrack(eventCode: string, playlistID: string, trackURI: string) {
        var url = config.baseAPIUrl + "/host/queueRemove/" + playlistID + "/" + trackURI;
        return this.http.get(url);
    }
    banTrack(eventCode: string, playlistID: string, trackURI: string) {
        var url = config.baseAPIUrl + "/host/banTrack/" + eventCode + "/" + playlistID + "/" + trackURI;
        return this.http.get(url);
    }
    unbanTrack(eventCode: string, playlistID: string, trackURI: string) {
        var url = config.baseAPIUrl + "/host/unbanTrack/" + eventCode + "/" + playlistID + "/" + trackURI;
        return this.http.get(url);
    }
    getAllBannedTracks(eventCode: string) {
        var url = config.baseAPIUrl + "/host/getAllBannedTracks/" + eventCode;
        return this.http.get<any>(url);
    }
}