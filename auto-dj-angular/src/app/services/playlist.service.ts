import config from '../config';
import { Playlist } from '../models/playlist';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SongItem } from '../models/songItem';
@Injectable()
export class PlaylistService {
    constructor(private http: HttpClient) { }
    createPlaylist(name: string) {
      var url = config.baseAPIUrl + "/createPlaylist/" + name;
      return this.http.get(url);
    }
    copyPlaylist(from: string, to: string) {
      var url = config.baseAPIUrl + "/copyPlaylist/" + from + "/" + to;
      return this.http.get(url);
    }
    getAllPlaylists() {
        var url = config.baseAPIUrl + "/getPlaylists";
        return this.http.get<Playlist[]>(url);
    }
    getPlaylistById(id: string) {
        var url = config.baseAPIUrl + "/getPlaylistByID/" + id;
        return this.http.get<Playlist>(url);
    }
    getTracksFromPlaylist(eventCode: string, id: string) {
      var url = config.baseAPIUrl + "/getTracks/" + eventCode + "/" + id;
      return this.http.get<SongItem[]>(url);
    }
}