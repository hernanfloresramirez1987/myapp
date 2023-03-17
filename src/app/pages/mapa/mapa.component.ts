import { AfterViewInit, Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Feature, MapaService } from 'src/app/services/mapa.service';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit {
  mapa!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
  addresses: Feature[] = [];
  selectedAddress = null;
  constructor(private mapboxServ: MapaService) {}
  ngAfterViewInit(): void {
    this.locate();
  }
  async locate() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);
    this.drawMap(coordinates.coords.longitude, coordinates.coords.latitude);
  }
  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if( searchTerm && searchTerm.length > 0 ) {
      this.mapboxServ
        .searchBasic(searchTerm)
        .subscribe((features: any) => {
          console.log(features);
          this.addresses = features.map((feat: Feature) => feat);
        })
    } else {
      this.addresses = [];
    }
  }
  onSelect(address: Feature) {
    //this.selectedAddress = address;
    this.addresses = [];
    console.log('///////////', address.center)
    this.drawMap(address.center[0], address.center[1])
  }
  drawMap(lng: number, lat: number) {
    (mapboxgl as any).accessToken = environment.mapboxPK;
    if(this.mapa === undefined) {
      this.mapa = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: 12.5
      });
      //this.createMarker(lng, lat);
    } else {
      console.log('aun no existe un mapa')
      this.mapa.setCenter([1, lat])
    }
    console.log(this.mapa)
  }
  /*createMarker(lng: number, lat: number) {
    const marker = new mapboxgl.Marker({draggable: true}).setLngLat([lng, lat]).addTo(this.mapa);
    marker.on('drag', () => {console.log('8****', marker.getLngLat())});
  }*/
  removeMarker() {

  }
}
