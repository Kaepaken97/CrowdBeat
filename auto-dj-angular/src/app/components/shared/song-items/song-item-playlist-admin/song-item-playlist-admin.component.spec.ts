import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongItemPlaylistAdminComponent } from './song-item-playlist-admin.component';

describe('SongItemPlaylistAdminComponent', () => {
  let component: SongItemPlaylistAdminComponent;
  let fixture: ComponentFixture<SongItemPlaylistAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongItemPlaylistAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongItemPlaylistAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
