import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oauth-callback.component.html',
  styleUrls: ['./oauth-callback.component.css']
})
export class OAuthCallbackComponent implements OnInit {

  message = "Completamento accesso...";

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // 1. Legge il token dalla query string
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');

      if (token) {

    if (typeof window !== 'undefined') {
    localStorage.setItem('auth-token', token);
    }

    this.message = "Accesso completato! Reindirizzamento...";

    setTimeout(() => {
      this.router.navigate(['/']);
   }, 1500);

  } else {
   this.message = "Token non ricevuto. Accesso fallito.";
  }

    });
  }
}
