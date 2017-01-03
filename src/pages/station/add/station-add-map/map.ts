import {Component, ViewChild, ElementRef} from '@angular/core';
import {
    NavController,
    LoadingController,
    NavParams,
    ViewController
} from 'ionic-angular';
import {Platform} from 'ionic-angular';


declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class StationMapDetailPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;

    location: any;
    marker: any;
    positionParam: any;
    mapDefaultControlls: boolean;

    defaultZoom = 16;

    constructor(private viewCtrl: ViewController, private platform: Platform, private navParams: NavParams, public navCtrl: NavController, private loadingCtrl: LoadingController) {

        this.mapDefaultControlls = !platform.is("core");

        this.positionParam = navParams.get("position");

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log('Platform ready');
            this.loadMap();
        });
    }

    ionViewLoaded() {
        this.loadMap();
    }

    loadMap() {
        let loader = this.loadingCtrl.create({
            content: "Lade Karte ...",
        });
        loader.present();

        let mapOptions = {
            center: this.positionParam,
            zoom: this.defaultZoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            fullscreenControl: false,
            disableDefaultUI: this.mapDefaultControlls
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        this.positionMarker(this.positionParam.lat(), this.positionParam.lng());

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            loader.dismissAll();
        });
    }

    positionMarker(lat, lng, panTo = true) {
        let latLng = new google.maps.LatLng(lat, lng);

        if (null == this.marker) {
            this.marker = new google.maps.Marker({
                draggable: true,
                position: latLng,
                map: this.map
            });
        }
        else {
            this.marker.setPosition(latLng);
        }

        if (panTo) {
            this.map.panTo(latLng);
        }

        google.maps.event.addListener(this.marker, 'dragend', () => {
            // setTimeout(() => this.map.panTo(this.marker.getPosition()), 200);
        });
    }

    dismiss() {
        this.viewCtrl.dismiss(this.marker.getPosition());
    }
}