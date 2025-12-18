import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappaInserzioniComponent } from './mappa-inserzioni.component';

describe('MappaInserzioniComponent', () => {
  let component: MappaInserzioniComponent;
  let fixture: ComponentFixture<MappaInserzioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MappaInserzioniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappaInserzioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
