import config from '../config';
import { Playlist } from '../models/playlist';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NoPlayListItem } from '../models/noPlayListItem';
@Injectable()
export class NoPlayListService {
    constructor(private http: HttpClient) { }
    getAllBannedTracks(eventCode: string) {
        var url = config.baseAPIUrl + "/host/getAllBannedTracks/" + eventCode;
        var result: NoPlayListItem[] = [];
        this.http.get<NoPlayListItem[]>(url).subscribe(x => {result = x;});
        return result;
    }

    banTrack(eventCode: string, trackName: string, trackID: string) {
        var url = config.baseAPIUrl + "/host/banTrack/" + eventCode + "/" + trackName + "/" + trackID;
        this.http.get(url).subscribe((x: any) => {});;
    }

    unbanTrack(id: number) {
        var url = config.baseAPIUrl + "/host/unbanTrack/" + id;
        this.http.get(url).subscribe((x: any) => {});;
    }
}