import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizzaInserzioneComponent } from './visualizza-inserzione.component';

describe('VisualizzaInserzioneComponent', () => {
  let component: VisualizzaInserzioneComponent;
  let fixture: ComponentFixture<VisualizzaInserzioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizzaInserzioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizzaInserzioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
