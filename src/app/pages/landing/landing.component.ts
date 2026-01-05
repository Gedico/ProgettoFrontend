import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Componenti
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { InserzioneCardComponent } from '../../components/inserzioni/inserzione-card/inserzione-card.component';

// Servizi e Modelli
import { InserzioneService } from '../../services/inserzioni.service';
import { InserzioneCard } from '../../models/inserzionecard';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SearchBarComponent,
    InserzioneCardComponent
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  ultime: InserzioneCard[] = [];
  private destroy$ = new Subject<void>();

  constructor(private inserzioneService: InserzioneService) {}

  ngOnInit(): void {
    this.caricaUltime();
  }

  caricaUltime(): void {
    this.inserzioneService.getUltimeInserzioni()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dati) => {
          this.ultime = dati;
        },
        error: (err) => {
          console.error("Errore caricamento ultime inserzioni:", err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
