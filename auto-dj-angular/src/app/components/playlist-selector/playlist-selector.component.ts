import {
  Component,
  OnInit
} from '@angular/core';
import {
  Playlist
} from '../../models/playlist';
import {
  PlaylistService
} from 'src/app/services/playlist.service';
import {
  EventService
} from 'src/app/services/event.service';
import {
  AdminService
} from 'src/app/services/admin.service';

@Component({
  selector: 'app-playlist-selector',
  templateUrl: './playlist-selector.component.html',
  styleUrls: ['./playlist-selector.component.scss']
})
export class PlaylistSelectorComponent implements OnInit {
  constructor(
    private playlistService: PlaylistService,
    private eventService: EventService,
    private hostService: AdminService) {}
  public playlists: Playlist[] = [];
  public eventPlaylists: Playlist[] = [];
  ngOnInit(): void {
    this.getPlaylistEventCards();
  }

  getPlaylistEventCards() {
    var self = this;
    this.playlistService.getAllPlaylists().subscribe(x => {
      self.playlists = x;
      this.hostService.getActiveHost().subscribe(host => {
        this.eventService.getEventByHost(host.id).subscribe(async x => {
          if (x) {
            for (var i = 0; i < x.length; i++) {
              this.playlistService.getPlaylistById(x[i].playlistID).subscribe(p => {
                if (p != null) {
                  if(self.playlists.filter(f => f.id == p.id)) {
                    var index = -1;
                    for(var j = 0; j < self.playlists.length; j++)
                    {
                      if(self.playlists[j].id == p.id){
                        index = j;
                      }
                    }
                    if(index != -1) {
                      self.playlists.splice(index, 1);
                    }
                    console.log(index);
                    console.log(self.playlists);
                  }
                  self.eventPlaylists.push(p);
                }
              })
            }
          }
        });
      });
    });
  }
}
