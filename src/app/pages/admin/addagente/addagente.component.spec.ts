import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddagenteComponent } from './addagente.component';

describe('AddagenteComponent', () => {
  let component: AddagenteComponent;
  let fixture: ComponentFixture<AddagenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddagenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddagenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
