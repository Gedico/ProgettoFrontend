import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MarkerDTO } from '../../../models/dto/Search/markerdto';

@Component({
  selector: 'app-mappa-interattiva',
  templateUrl: './mappainterattiva.component.html',
  styleUrls: ['./mappainterattiva.component.css']
})
export class MappaInterattivaComponent implements AfterViewInit, OnChanges {

  @Input() inserzioniPreview: MarkerDTO[] = [];

  private map!: google.maps.Map;
  private markers: google.maps.marker.AdvancedMarkerElement[] = [];

  ngAfterViewInit(): void {
  this.map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      center: { lat: 41.9028, lng: 12.4964 },
      zoom: 6,
      mapId: 'DEMO_MAP_ID',
      gestureHandling: 'greedy'
    }
  );

  if (this.inserzioniPreview.length > 0) {
    this.renderMarkers();
  }
}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inserzioniPreview'] && !changes['inserzioniPreview'].firstChange) {
      console.log('Nuovi marker ricevuti:', this.inserzioniPreview);
      this.clearMarkers();
      this.renderMarkers();
    }
  }


/*------------MARKERS MAPPA-----------------------------------------------------------------------------------------------------------------------*/  

  private renderMarkers(): void {
  if (!this.inserzioniPreview || this.inserzioniPreview.length === 0) return;

  const bounds = new google.maps.LatLngBounds();

  this.inserzioniPreview.forEach(m => {
    const position = { lat: m.latitudine, lng: m.longitudine };

    // Elemento HTML marker
    const markerDiv = document.createElement('div');
markerDiv.innerHTML = `
  <div style="
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    text-align: center;
    margin-bottom: 4px;
  ">€ ${m.prezzo}</div>
  <div style="
    width: 20px;
    height: 20px;
    background-color: #4CAF50;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  "></div>
`;


    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      map: this.map,
      content: markerDiv
    });

    marker.addListener('click', () => {
      window.open(`#/inserzione/${m.id}`, '_blank');
    });

    this.markers.push(marker);
    bounds.extend(position);
  });

  this.map.fitBounds(bounds);
}




  private clearMarkers(): void {
  this.markers.forEach(marker => marker.map = null);
  this.markers = [];
}

}





