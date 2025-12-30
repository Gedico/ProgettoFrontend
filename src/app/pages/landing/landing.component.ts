  import { Component, OnInit } from '@angular/core';
  import { RouterModule } from '@angular/router';
  import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
  import { CommonModule } from '@angular/common';
  import { InserzioneCardComponent } from '../../components/inserzioni/inserzione-card/inserzione-card.component';
  import { InserzioneService} from '../../services/inserzioni.service';
  import { InserzioneCard } from '../../models/inserzionecard';
  import {Subject, takeUntil} from 'rxjs';
  import { ReactiveFormsModule } from '@angular/forms';

  @Component({
    selector: 'app-landing',
    standalone: true,
    imports: [ RouterModule, SearchBarComponent, CommonModule, InserzioneCardComponent,ReactiveFormsModule],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
  })
  export class LandingPageComponent implements OnInit {

    ultime: InserzioneCard[] = [];

    constructor(private inserzioneService: InserzioneService) {}

    private destroy$ = new Subject<void>();

    ngOnInit(): void {
      this.caricaUltime();
    }

    caricaUltime() {
      this.inserzioneService.getUltimeInserzioni()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: dati => this.ultime = dati,
          error: err => console.error("Errore caricamento ultime inserzioni:", err)
        });
    }

    ngOnDestroy(): void {
      this.destroy$.next(undefined);
      this.destroy$.complete();
    }
  }
