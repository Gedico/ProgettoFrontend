import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPosizioneComponent } from './step-posizione.component';

describe('StepPosizioneComponent', () => {
  let component: StepPosizioneComponent;
  let fixture: ComponentFixture<StepPosizioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPosizioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepPosizioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
