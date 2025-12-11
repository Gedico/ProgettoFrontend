import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuovaInserzioneComponent } from './nuova-inserzione.component';

describe('NuovaInserzioneComponent', () => {
  let component: NuovaInserzioneComponent;
  let fixture: ComponentFixture<NuovaInserzioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuovaInserzioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuovaInserzioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
