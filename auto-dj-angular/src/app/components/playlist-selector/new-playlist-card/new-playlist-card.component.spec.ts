import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlaylistCardComponent } from './new-playlist-card.component';

describe('NewPlaylistCardComponent', () => {
  let component: NewPlaylistCardComponent;
  let fixture: ComponentFixture<NewPlaylistCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPlaylistCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPlaylistCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
