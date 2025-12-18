import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InserzioneMappa} from '../../models/dto/inserzione-mappa/InserzioneMappa';

declare const google: any;

@Component({
  selector: 'app-mappa-inserzioni',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="map" style="width:100%; height:400px;"></div>`
})
export class MappaInserzioniComponent implements AfterViewInit {

  map!: any;

  inserzioni: InserzioneMappa[] = [
    {
      idInserzione: 1,
      comune: 'Milano',
      latitudine: 45.468,
      longitudine: 9.182,
      prezzo: 250000
    }
  ];

  ngAfterViewInit(): void {
    const centroComune = { lat: 45.464211, lng: 9.191383 };

    this.map = new google.maps.Map(
      document.getElementById('map'),
      {
        center: centroComune,
        zoom: 13
      }
    );

    this.aggiungiMarker();
  }

  aggiungiMarker() {
    this.inserzioni.forEach(i => {
      const marker = new google.maps.Marker({
        position: { lat: i.latitudine, lng: i.longitudine },
        map: this.map,
        label: `${i.prezzo.toLocaleString()} €`
      });

      marker.addListener('click', () => {
        window.open(`/inserzione/${i.idInserzione}`, '_blank');
      });
    });
  }
}

