import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { NavigationControl, Marker, Map, Popup, GeoJSONSource } from 'mapbox-gl';
import { Feature, MapaService } from 'src/app/services/mapa.service';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment.prod';
//import { DirectionsService } from '@mapbox/mapbox-sdk/services/directions';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  mapa!: Map;
  //directions!: DirectionsService;
  marker!: Marker;
  addresses: Feature[] = [];
  selectedAddress = null;
  popupUbicacion = new Popup().setHTML('Estoy aqui')

  nav = new NavigationControl();

  constructor(private mapboxServ: MapaService) {}

  ngOnInit(): void {
    this.locate();
    this.searchDirections();
  }
  async locate() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);
    //this.drawMap(coordinates.coords.longitude, coordinates.coords.latitude);
    this.mapboxServ.buildMap();
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
  onSelect(address: Feature) { //this.selectedAddress = address;
    this.addresses = [];
    console.log('///////////', address.center)
    //this.drawMap(address.center[0], address.center[1])
    this.mapboxServ.addMarker(address.center[0], address.center[1])
  }
  removeMarker() {

  }
  drawRoutes() {
    console.log("Hola mundo")
    this.mapa.addLayer({
      id: 'ruta',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [-65.7160422117201, -21.445767101120342],
              [-65.71687850093241, -21.444416598540272],
              [-65.71865894979871, -21.444416598540272],
            ]
          }
        }
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#888',
        'line-width': 8
      }
    });
  }
  searchDirections() {
    //this.mapa.addControl(this.nav, 'top-right');
    const startMarker = new Marker({ color: 'red' });
    const endMarker = new Marker({ color: 'blue' });

    // Agregar marcadores a las coordenadas de inicio y fin
    startMarker.setLngLat([-65.7160422117201, -21.445767101120342]);
    startMarker.addTo(this.mapa);

    endMarker.setLngLat([-65.71865894979871, -21.444416598540272]);
    endMarker.addTo(this.mapa);
    //this.mapa.addControl(new DirectionsService, )

  }

  getDirections() {
    const origin = [-74.5, 40]; // Ejemplo origen
    const destination = [-73.9, 40.7]; // Ejemplo destino

    this.mapa.addControl(this.nav, 'top-right');
    const startMarker = new Marker({ color: 'red' });
    const endMarker = new Marker({ color: 'blue' });

    // Agregar marcadores a las coordenadas de inicio y fin
    startMarker.setLngLat([-74.5, 40]);
    startMarker.addTo(this.mapa);

    endMarker.setLngLat([-74.5, 40.5]);
    endMarker.addTo(this.mapa);

  }
}
