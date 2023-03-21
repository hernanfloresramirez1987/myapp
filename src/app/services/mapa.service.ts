import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

import * as mapboxgl from 'mapbox-gl';
import { NavigationControl, Marker, Map, Popup, GeoJSONSource } from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export interface MapboxOutput {
  attribution?: string;
  features?: Feature[];
  query?: [];
  type?: string;
}
export interface Feature {
  id: string;
  place_name: string;
  center: [number, number];
}

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  readonly url = `https://api.mapbox.com/`;

  mapbox =(mapboxgl as typeof mapboxgl)
  mapa! : Map;
  style = 'mapbox://styles/mapbox/streets-v12';
  lat = -21.44;
  lng = -65.71;
  zoom = 11;
  popupUbicacion = new Popup().setHTML('Estoy aqui')

  constructor(private http: HttpClient) {
    this.mapbox.accessToken = environment.mapboxPK
  }

  buildMap(): Promise<any> {
    return new Promise((resolve, reject) => {
      try{
        this.mapa = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          zoom: this.zoom,
          pitch: 45,
          center: [ this.lng, this.lat ]
        });
        this.mapa.addControl(new mapboxgl.NavigationControl)
       // this.addMarker(this.lng, this.lat);

        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl,
        });

        geocoder.on('result',($event => {
          const { result } = $event;

          this.addMarker(result.center[0], result.center[1]);
          //geocoder.clear();
          console.log('****: ', result.center);
        }))

        resolve({
          map: this.mapa,
          geocoder
        });
      } catch(e) {
        console.log(e);
        reject(e);
      }
    })
  }
  addMarker(lng: number, lat: number) {
    console.log(lng,lat)
    const marker = new Marker({draggable: true})
                    .setLngLat([lng, lat])
                    .setRotation(45)
                    .setPopup(this.popupUbicacion)
                    .addTo(this.mapa);
    marker.on('drag', () => {
      console.log('linea 67./****: ', marker.getLngLat());
    });
    this.mapa.setCenter([lng, lat]);
  }

  searchBasic(parameters: string) {
    const _url = `${this.url}geocoding/v5/mapbox.places/${parameters}.json?access_token=${environment.mapboxPK}`;
    console.log(_url);
    return this.http.get(_url)
      .pipe(map((res: MapboxOutput) => {
        return res.features;
      }));
  }

  searchProximity(lngIni: number, latIni: number, lngFin: number, latFin: number, params: string) {
    //const _url = `${this.url}mapboxPK/${params}.json?proximity=${lng},${lat}&access_token=${environment.mapboxPK}`;
    const _url = [
                  `${this.url}directions/v5/mapbox/driving/`,
                  `${lngIni},${latIni},${lngFin},${latFin}`,
                  `?steps=true&geometries=geojson&access_token=${environment.mapboxPK}`
                ].join('');
    console.log('URL: ', _url);
    return this.http.get(_url)
      .pipe(map((res: MapboxOutput) => {
        return res.features;
      }));
  }
}
