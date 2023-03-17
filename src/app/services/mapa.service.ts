import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


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

  readonly url = `https://api.mapboxPK/geocoding/v5/`;
  constructor(private http: HttpClient) { }

  searchBasic(parameters: string) {
    const _url = `${this.url}mapbox.places/${parameters}.json?access_token=${environment.mapboxPK}`;
    return this.http.get(_url)
      .pipe(map((res: MapboxOutput) => {
        return res.features;
      }));
  }
  searchProximity(lng: number, lat: number, params: string) {
    const _url = `${this.url}mapboxPK/${params}.json?proximity=${lng},${lat}&access_token=${environment.mapboxPK}`;
    console.log('URL: ', _url);
    return this.http.get(_url)
      .pipe(map((res: MapboxOutput) => {
        return res.features;
      }));
  }
}
