import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { PlaceLocation } from '../models/place.model'

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  requestLocation(callback){
    //W3C Geolocation API
    navigator.geolocation.getCurrentPosition(
      position=>{
        callback(position.coords);
      },
      err=>{
        callback(null);
      }
    )
  }

  getMapLink(location: PlaceLocation){
    //Universal Link
    //<a href = "https://maps.google.com/"
    let query = "";
    if(location.latitude){
      query = location.latitude+ ","+ location.longitude;
    }else{
      query = `${location.address},${location.city}`
    }

    if(/ipad|iPhone|iPod/.test(navigator.userAgent)){
      return `https://maps.apple.com/?q=${query}`;
    }
    else if (/Android/.test(navigator.userAgent)){
      return `https://maps.google.com/?q=${query}`;
    }else{
      return `https://google.com/maps/place/?q=${query}`
    }
  }
}
