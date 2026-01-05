import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';

declare const google: any;

@Component({
  standalone: true,
  selector: 'app-step-mappa',
  templateUrl: './step-mappa.component.html',
  styleUrls: ['./step-mappa.component.css'],
  imports: [CommonModule, DecimalPipe]
})
export class StepMappaComponent implements AfterViewInit, OnDestroy {

  @Input() posizioneForm!: FormGroup;
  @Output() avanti = new EventEmitter<void>();
  @Output() indietro = new EventEmitter<void>();

  private map!: any;
  private marker!: any;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.marker) {
      this.marker.setMap(null);
    }
  }

  private initMap(): void {
    const lat = this.posizioneForm.get('latitudine')?.value ?? 41.8719;
    const lng = this.posizioneForm.get('longitudine')?.value ?? 12.5674;

    const center = { lat, lng };

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center,
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false
      }
    );

    this.marker = new google.maps.Marker({
      position: center,
      map: this.map,
      draggable: true
    });

    // quando sposto il marker → aggiorno il form
    this.marker.addListener('dragend', (event: any) => {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();

      this.posizioneForm.patchValue({
        latitudine: newLat,
        longitudine: newLng
      });

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        { location: { lat: newLat, lng: newLng } },
        (results: any[], status: string) => {
          if (status === 'OK' && results && results.length > 0) {
            this.posizioneForm.patchValue({
              indirizzo: results[0].formatted_address
            });
          }
        }
      );
    });
  }
}
