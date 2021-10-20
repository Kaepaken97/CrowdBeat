import config from '../config';
import { Playlist } from '../models/playlist';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SongItem } from '../models/songItem';
@Injectable()
export class SearchService {
    constructor(private http: HttpClient) { }
    search(search: string) {
        var url = config.baseAPIUrl + "/search/" + search;
        return this.http.get<SongItem[]>(url);
    }
}