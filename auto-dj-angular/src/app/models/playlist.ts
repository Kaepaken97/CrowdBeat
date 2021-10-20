import { SongItem } from "./songItem";

export class Playlist {
    href: string = "";
    id: string = "";
    images: any[] = []; //make image obj
    name: string = "";
    tracks_link: string = "";
    songs: SongItem[] = [];
}