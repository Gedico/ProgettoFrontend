import {Component, Input, Output, EventEmitter} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


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




}
