import config from '../config';
import { Playlist } from '../models/playlist';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SongItem } from '../models/songItem';
import { Event } from '../models/event';
import { Vote } from '../models/vote';
@Injectable()
export class EventService {
    constructor(private http: HttpClient) { }
    getEventByHost(hostID: string) {
        var url = config.baseAPIUrl + '/event/getEventByHostID/' + hostID;
        var result = this.http.get<Event[]>(url);
        return result;
    }

    getEventByPlaylist(playlistID: string) {
        var url = config.baseAPIUrl + '/event/getByPlaylistID/' + playlistID;
        var result = this.http.get<Event>(url);
        return result;
    }

    resetCurrentlyPlaying(eventCode: string) {
        console.log("resetting")
        var url = config.baseAPIUrl + '/event/resetCurrentlyPlaying/' + eventCode;
        return this.http.get(url);
    }

    getEventByEventCode(eventCode: string) {
        var url = config.baseAPIUrl + '/event/getEvent/' + eventCode;
        return this.http.get<Event>(url);
    }

    getAllVotes(eventCode: string) {
        var url = config.baseAPIUrl + '/event/getAllVotes/' + eventCode;
        return this.http.get<Vote[]>(url);
    }

    getAllVotedBy(eventCode: string, userCookie: string) {
        var url = config.baseAPIUrl + '/event/getAllVotedBy/' + eventCode + "/" + userCookie;
        console.log(url);
        return this.http.get<string[]>(url);
    }

    getAllAddedBy(eventCode: string, userCookie: string) {
        var url = config.baseAPIUrl + '/event/getAllAddedBy/' + eventCode + "/" + userCookie;
        return this.http.get<string[]>(url);
    }

    addAllUnaddedTracks(eventCode: string, playlistID: string) {
        var url = config.baseAPIUrl + '/eventTracks/addUnaddedTracks/' + eventCode + "/" + playlistID;
        return this.http.get(url);
    }
}