import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { GoogleMaps, 
         GoogleMap,
         CameraPosition,
         LatLng,
         GoogleMapsEvent,
         Marker,
         MarkerOptions } from '@ionic-native/google-maps';

import { Geolocation } from '@ionic-native/geolocation'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;

  constructor(public navCtrl: NavController,
              private _googleMaps: GoogleMaps,
              private _geoLoc: Geolocation,
              private _toastCtrl: ToastController) {

  }

  ngAfterViewInit(){
    let loc: LatLng;
    this.initMap();
    

    //once the map is ready move
    //camera into position
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        //Get User location
      this.getLocation().then( res => {
      //Once location is gotten, we set the location on the camera.
        loc = new LatLng(res.coords.latitude, res.coords.longitude);
        this.moveCamera(loc);
        this.createMarker(loc, "Me").then((marker: Marker) => {
          marker.showInfoWindow();
        }).catch(err => {
          console.log(err);
        });
      }).catch( err => {
        console.log(err);
      });
    
    });
  }

  initMap(){
    let element = this.mapElement.nativeElement;
    this.map = this._googleMaps.create(element)
  }

  getLocation(){
    return this._geoLoc.getCurrentPosition();
  }

  toast(msg: string){
    const toast = this._toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

//Moves the camera to any location
  moveCamera(loc: LatLng){
     let options: CameraPosition = {
        //specify center of map
        target: loc,
        zoom: 15,
        tilt: 10 
      }
      this.map.moveCamera(options)
  }

  //Adds a marker to the map
  createMarker(loc: LatLng, title: string){
    let markerOptions: MarkerOptions = {
      position: loc,
      title: title
    }; 
    
    return  this.map.addMarker(markerOptions);
  }


}
