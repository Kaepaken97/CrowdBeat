import config from '../config';
import { Playlist } from '../models/playlist';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SongItem } from '../models/songItem';
@Injectable()
export class MediaPlayerService {
    constructor(private http: HttpClient) { }
    getDevices() {
        var url = config.baseAPIUrl + "/mediaplayer/getDevices";
        return this.http.get<any[]>(url);
    }

    getCurrentlyPlayingTrack(eventCode: String) {
        var url = config.baseAPIUrl + "/mediaplayer/getCurrentlyPlayingTrack/" + eventCode;
        //console.log("getting track");
        return this.http.get<any>(url);
    }

    transferPlayback(id: String) {
        var url = config.baseAPIUrl + "/mediaplayer/transferPlayback/" + id;
        return this.http.get(url, { responseType: "text"});
    }

    play(id: string = "") {
        var url = config.baseAPIUrl + "/mediaplayer/play";
        if(id != "" && id != null && id != undefined) {
            url += "/" + id;
        }
        return this.http.get(url, { responseType: "text"});
    }

    pause() {
        var url = config.baseAPIUrl + "/mediaplayer/pause";
        return this.http.get(url, { responseType: "text"});
    }

    nextTrack() {
        var url = config.baseAPIUrl + "/mediaplayer/nextTrack";
        return this.http.get(url, { responseType: "text"});
    }

    previousTrack() {
        var url = config.baseAPIUrl + "/mediaplayer/previousTrack";
        return this.http.get(url, { responseType: "text"});
    }

    updateVolume(volume: number) {
        var url = config.baseAPIUrl + "/mediaplayer/updateVolume/" + volume;
        return this.http.get(url, {responseType: "text"});
    }
}