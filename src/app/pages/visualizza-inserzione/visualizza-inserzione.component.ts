import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InserzioneResponse } from '../../models/inserzioneresponse';
import { InserzioneService } from '../../services/inserzioni.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-visualizza-inserzione',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './visualizza-inserzione.component.html',
  styleUrls: ['./visualizza-inserzione.component.css']
})
export class VisualizzaInserzioneComponent implements OnInit {

  id!: number;
  inserzione!: InserzioneResponse;
  caricamento = true;

  /** 🔥 URL della mappa sanitizzato */
  mappaUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private inserzioneService: InserzioneService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.inserzioneService.getInserzioneById(this.id).subscribe({
      next: (data) => {
        this.inserzione = data;

        /** 🔥 CREAZIONE URL Mappa SICURO */
        this.mappaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://maps.google.com/maps?q=${data.posizione.latitudine},${data.posizione.longitudine}&z=15&output=embed`
        );

        this.caricamento = false;
      },
      error: (err) => {
        console.error("Errore caricamento inserzione:", err);
        this.caricamento = false;
      }
    });
  }
}
