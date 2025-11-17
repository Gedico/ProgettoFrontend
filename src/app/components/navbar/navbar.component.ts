import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router) { }

  // Mostra barra di ricerca solo nella landing
  get showSearch(): boolean {
    return this.router.url === '/';
  }

  
  // Testo del pulsante
  get buttonLabel(): string {
    return this.router.url === '/' ? 'Login' : 'Home';
  }

  // Link del pulsante
  get buttonLink(): string {
    return this.router.url === '/' ? '/login' : '/';
  }

}
