import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InserzioneService } from '../../services/inserzioni.service';
import { InserzioneResponse } from '../../models/inserzioneresponse';
import { CommonModule } from '@angular/common';
import { InserzioneCardComponent } from '../../components/inserzioni/inserzione-card/inserzione-card.component';

@Component({
  selector: 'app-risultati-ricerca',
  standalone: true,
  imports: [CommonModule, InserzioneCardComponent],
  templateUrl: './risultati-ricerca.component.html',
  styleUrls: ['./risultati-ricerca.component.css']
})
export class RisultatiRicercaComponent implements OnInit {

  risultati: InserzioneResponse[] = [];
  nessunRisultato = false;

  constructor(
    private route: ActivatedRoute,
    private inserzioneService: InserzioneService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cerca(params);
    });
  }

  cerca(params: any) {
    this.inserzioneService.ricercaInserzioni(params).subscribe({
      next: (data) => {
        this.risultati = data;
        this.nessunRisultato = data.length === 0;
      },
      error: () => {
        this.risultati = [];
        this.nessunRisultato = true;
      }
    });
  }
}
