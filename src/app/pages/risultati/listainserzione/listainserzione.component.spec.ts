import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListainserzioneComponent } from './listainserzione.component';

describe('ListainserzioneComponent', () => {
  let component: ListainserzioneComponent;
  let fixture: ComponentFixture<ListainserzioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListainserzioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListainserzioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
