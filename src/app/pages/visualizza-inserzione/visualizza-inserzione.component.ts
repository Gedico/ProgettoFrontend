import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { InserzioneResponse } from '../../models/inserzioneresponse';
import { InserzioneService } from '../../services/inserzioni.service';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-visualizza-inserzione',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, NavbarComponent],
  templateUrl: './visualizza-inserzione.component.html',
  styleUrl: './visualizza-inserzione.component.css'
})
export class VisualizzaInserzioneComponent implements OnInit {

  id!: number; // conterrà l'id preso dall'URL
  inserzione!: InserzioneResponse; 
  caricamento = true;

  constructor(private route: ActivatedRoute,
              private inserzioneService: InserzioneService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.inserzioneService.getInserzioneById(this.id).subscribe({
      next: (data) => {
        this.inserzione = data;
        this.caricamento = false;
        console.log("Dati inserzione ricevuti:", data);
      },
      error: (err) => {
        console.error("Errore caricamento inserzione:", err);
        this.caricamento = false;
      }
    });
  }
}
