import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepImmaginiComponent } from './step-immagini.component';

describe('StepImmaginiComponent', () => {
  let component: StepImmaginiComponent;
  let fixture: ComponentFixture<StepImmaginiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepImmaginiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepImmaginiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
