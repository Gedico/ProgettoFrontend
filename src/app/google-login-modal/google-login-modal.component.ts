import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-google-login-modal',
  standalone: true,
  templateUrl: './google-login-modal.component.html',
  styleUrls: ['./google-login-modal.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class GoogleLoginModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {

    let provider = this.data?.provider ?? 'google';

    // URL di redirect in base al provider
    const redirectMap: any = {
      google: 'http://localhost:8080/oauth2/authorization/google',
      facebook: 'http://localhost:8080/oauth2/authorization/facebook',
      github: 'http://localhost:8080/oauth2/authorization/github'
    };

    const url = redirectMap[provider];

    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  }
}


