import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { InserzioneCardComponent } from '../../components/inserzioni/inserzione-card/inserzione-card.component';
import { InserzioneService} from '../../services/inserzioni.service';
import { InserzioneCard } from '../../models/inserzionecard';



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ RouterModule, SearchBarComponent, CommonModule, InserzioneCardComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingPageComponent implements OnInit {

  ultime: InserzioneCard[] = [];

  constructor(private inserzioneService: InserzioneService) {}

  ngOnInit(): void {
    this.caricaUltime();
  }

  caricaUltime() {
    this.inserzioneService.getUltimeInserzioni().subscribe({
      next: (dati) => {
        this.ultime = dati;
      },
      error: (err) => {
        console.error("Errore caricamento ultime inserzioni:", err);
      }
    });
  }
}
