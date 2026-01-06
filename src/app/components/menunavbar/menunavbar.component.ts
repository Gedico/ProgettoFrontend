import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menunavbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menunavbar.component.html',
  styleUrl: './menunavbar.component.css'
})
export class MenunavbarComponent {
  @Input() role: string | null = null;
  @Input() logout!: () => void;
  @Output() close = new EventEmitter<void>();

  onLogout() {
    if (this.logout) this.logout();
    this.close.emit();
  }

  onNavigate() {
    this.close.emit();
  }
}
