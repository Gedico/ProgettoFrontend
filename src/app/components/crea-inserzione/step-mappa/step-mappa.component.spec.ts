import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepMappaComponent } from './step-mappa.component';

describe('StepMappaComponent', () => {
  let component: StepMappaComponent;
  let fixture: ComponentFixture<StepMappaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepMappaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepMappaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
