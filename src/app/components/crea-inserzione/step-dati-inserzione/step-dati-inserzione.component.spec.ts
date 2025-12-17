import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepDatiInserzioneComponent } from './step-dati-inserzione.component';

describe('StepDatiInserzioneComponent', () => {
  let component: StepDatiInserzioneComponent;
  let fixture: ComponentFixture<StepDatiInserzioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepDatiInserzioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepDatiInserzioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
