import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSliderModule} from '@angular/material/slider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';

import { AppComponent } from './app.component';
import { PlaylistDisplayComponent } from './components/shared/playlist-display/playlist-display.component';
import { SongItemSearchUserComponent } from './components/shared/song-items/song-item-search-user/song-item-search-user.component';
import { SongItemSearchAdminComponent } from './components/shared/song-items/song-item-search-admin/song-item-search-admin.component';
import { SongItemPlaylistUserComponent } from './components/shared/song-items/song-item-playlist-user/song-item-playlist-user.component';
import { SongItemPlaylistAdminComponent } from './components/shared/song-items/song-item-playlist-admin/song-item-playlist-admin.component';
import { SearchComponent } from './components/shared/search/search.component';
import { MediaPlayerComponent } from './components/shared/media-player/media-player.component';
import { AdminPortalComponent } from './components/admin-portal/admin-portal.component';
import { HomeComponent } from './components/home/home.component';
import { PlaylistSelectorComponent } from './components/playlist-selector/playlist-selector.component';
import { PlaylistCardComponent } from './components/playlist-selector/playlist-card/playlist-card.component';
import { PlaylistService } from './services/playlist.service';
import { FormsModule } from '@angular/forms';
import { DeviceSelector } from './components/shared/media-player/device-selector.component';
import { UserPortalComponent } from './components/user-portal/user-portal.component';
import { NewPlaylistCardComponent } from './components/playlist-selector/new-playlist-card/new-playlist-card.component';

import { EventModal } from './components/shared/event-modal/event-modal.component';
import { HelpModal } from './components/shared/help-modal/help-modal.component';
import { SettingsModal } from './components/admin-portal/settings-modal/settings-modal.component';
import { NoPlayListModal } from './components/admin-portal/no-play-list-modal/no-play-list-modal.component';
import { ManageUsersModal } from './components/admin-portal/manage-users-modal/manage-users-modal.component';

import { SearchService } from './services/search.service';
import { MediaPlayerService } from './services/mediaplayer.service';
import { NoPlayListService } from './services/noPlayList.service';
import { ManageUsersService } from './services/manageUsers.service';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';
import { AdminService } from './services/admin.service';
import { HttpErrorInterceptor } from './services/http-error-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    PlaylistDisplayComponent,
    SongItemPlaylistAdminComponent,
    SongItemPlaylistUserComponent,
    SongItemSearchAdminComponent,
    SongItemSearchUserComponent,
    SearchComponent,
    MediaPlayerComponent,
    AdminPortalComponent,
    UserPortalComponent,
    HomeComponent,
    PlaylistSelectorComponent,
    PlaylistCardComponent,
    NewPlaylistCardComponent,
    DeviceSelector,
    EventModal,
    HelpModal,
    SettingsModal,
    NoPlayListModal,
    ManageUsersModal
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatSliderModule,
    MatDialogModule,
    MatTabsModule
  ],
  providers: [
    PlaylistService, 
    SearchService, 
    AdminService,
    MediaPlayerService, 
    NoPlayListService,
    EventService,
    UserService,
    ManageUsersService,
    MatDialogModule, {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {}
