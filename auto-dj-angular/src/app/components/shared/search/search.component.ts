import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SongItem } from 'src/app/models/songItem';
import { PlaylistService } from 'src/app/services/playlist.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
@Input() playlistID: string = "";
@Input() mode: string = "";
@Output() refreshParent = new EventEmitter<string>();

userCookie: string | null = null;
  constructor(private playlistService: PlaylistService, 
    private searchService: SearchService,
    private http: HttpClient) { }

  ngOnInit(): void {
  }

  results: SongItem[] = [];
  searchValue: string = "";

  search() {
    var self = this;
    this.searchService.search(this.searchValue).subscribe(x => {
      self.results = x;
    })
  }

  refresh() {
    //console.log("refreshing parent");
    this.refreshParent.emit();
  }
}
