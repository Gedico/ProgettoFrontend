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
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private readonly inserzioneService: InserzioneService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.caricaInserzioni();
  }

  private caricaInserzioni(): void {
    this.loading = true;
    this.errorMessage = null;

    this.inserzioneService.getInserzioniAgente().subscribe({
      next: (res) => {
        this.mieInserzioni = res ?? [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Si è verificato un errore durante il caricamento delle inserzioni.';
        this.loading = false;
      }
    });
  }

  apriDettagli(id: number): void {
    if (id == null) {
      return;
    }
    this.router.navigate(['/inserzione', id]);
  }
}
