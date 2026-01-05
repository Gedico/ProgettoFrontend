import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInserzioniComponent } from './listainserzione.component'

describe('ListaInserzioniComponent', () => {
  let component: ListaInserzioniComponent;
  let fixture: ComponentFixture<ListaInserzioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaInserzioniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaInserzioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
