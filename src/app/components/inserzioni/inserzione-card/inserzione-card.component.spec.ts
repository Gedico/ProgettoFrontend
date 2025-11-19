import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserzioneCardComponent } from './inserzione-card.component';

describe('InserzioneCardComponent', () => {
  let component: InserzioneCardComponent;
  let fixture: ComponentFixture<InserzioneCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InserzioneCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InserzioneCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
