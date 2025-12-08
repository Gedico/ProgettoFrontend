import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

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
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');

      if (token) {

        this.authService.handleOAuthCallback(token);

        this.message = "Accesso completato! Reindirizzamento...";

        setTimeout(() => this.router.navigate(['/']), 1500);

      } else {

        this.message = "Token non ricevuto. Accesso fallito.";

        setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    });
  }
}

