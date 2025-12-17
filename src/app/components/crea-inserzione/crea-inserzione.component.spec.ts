import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaInserzioneComponent } from './crea-inserzione.component';

describe('CreaInserzioneComponent', () => {
  let component: CreaInserzioneComponent;
  let fixture: ComponentFixture<CreaInserzioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreaInserzioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaInserzioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
