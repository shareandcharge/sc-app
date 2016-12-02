import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ModalController, LoadingController, PopoverController , NavParams} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {Platform} from 'ionic-angular';


declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapDetailPage {

    /*constructor(public navCtrl: NavController) {

     }*/

    address;

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    placesService: any;
    private platform;
    location:any;

    defaultZoom = 16;

    constructor(public popoverCtrl: PopoverController, platform: Platform,private navParams: NavParams ,public navCtrl: NavController, private modalCtrl: ModalController, private loadingCtrl: LoadingController) {
        this.platform = platform;
        
        this.location = navParams.get("location");
        this.address = {
            place: ''
        };

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log('Platform ready');
            this.loadMap();

        });
    }

    ionViewLoaded(){
        this.loadMap();
    }

    loadMap(){

        console.log("loading the map");
        let loader = this.loadingCtrl.create({
            content: "Loading map ...",
        });
        loader.present();

        let latLng = new google.maps.LatLng(this.location.latitude, this.location.longitude);

        let mapOptions = {
            center: latLng,
            zoom: this.defaultZoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            fullscreenControl: false
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.location.latitude, this.location.longitude),
            map: this.map
        });

        let me = this;

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            loader.dismissAll();
        });

    }

}
