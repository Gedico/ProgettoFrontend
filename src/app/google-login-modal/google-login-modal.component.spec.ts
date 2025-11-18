import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleLoginModalComponent } from './google-login-modal.component';

describe('GoogleLoginModalComponent', () => {
  let component: GoogleLoginModalComponent;
  let fixture: ComponentFixture<GoogleLoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleLoginModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleLoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
