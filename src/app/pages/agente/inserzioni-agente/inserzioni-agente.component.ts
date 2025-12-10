import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InserzioneCard } from '../../../models/inserzionecard';
import { InserzioneService } from '../../../services/inserzioni.service'
import { InserzioneCardComponent } from '../../../components/inserzioni/inserzione-card/inserzione-card.component'
import { Router } from '@angular/router';

@Component({
  selector: 'app-inserzioni-agente',
  standalone: true,
  imports: [CommonModule, InserzioneCardComponent],
  templateUrl: './inserzioni-agente.component.html',
  styleUrls: ['./inserzioni-agente.component.css']
})
export class InserzioniAgenteComponent implements OnInit {

  mieInserzioni: InserzioneCard[] = [];

  constructor(
    private inserzioneService: InserzioneService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inserzioneService.getInserzioniAgente().subscribe({
      next: (res) => this.mieInserzioni = res,
      error: (err) => console.error("Errore caricamento inserzioni:", err)
    });
  }

  apriDettagli(id: number) {
    this.router.navigate(['/inserzione', id]);
  }
}
