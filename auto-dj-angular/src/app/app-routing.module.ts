import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminPortalComponent} from './components/admin-portal/admin-portal.component';
import {HomeComponent} from './components/home/home.component';
import {PlaylistSelectorComponent} from './components/playlist-selector/playlist-selector.component';
import { UserPortalComponent } from './components/user-portal/user-portal.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'playlist-selector', component: PlaylistSelectorComponent},
  {path: 'admin-portal/:eventCode', component: AdminPortalComponent},
  {path: 'user-portal/:eventCode/:userCookie', component: UserPortalComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
