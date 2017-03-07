import {Component, ViewChild, ElementRef} from '@angular/core';
import {
    NavController, LoadingController, NavParams,
    ViewController
} from 'ionic-angular';
import {Platform} from 'ionic-angular';
import {Location} from "../../../models/location";
import {LocationService} from "../../../services/location.service";


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
    private platform;
    location: Location;
    mapDefaultControlls: boolean;

    defaultZoom = 16;

    constructor(private viewCtrl: ViewController, platform: Platform, private navParams: NavParams,
                public navCtrl: NavController, private loadingCtrl: LoadingController,
                private locationService: LocationService) {
        this.platform = platform;

        this.mapDefaultControlls = !this.platform.is("core");

        this.location = navParams.get("location");
        this.address = {
            place: ''
        };

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.loadMap();

        });
    }

    ionViewLoaded() {
        this.loadMap();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    loadMap() {

        let loader = this.loadingCtrl.create({
            content: "Lade Karte ...",
        });
        loader.present();

        let latLng = new google.maps.LatLng(this.location.lat, this.location.lng);

        let mapOptions = {
            center: latLng,
            zoom: this.defaultZoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            fullscreenControl: false,
            disableDefaultUI: this.mapDefaultControlls
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        let image = this.locationService.isBusy(this.location) ? 'busy.png' : 'available.png';
        let icon = `assets/icons/marker/${image}`;

        new google.maps.Marker({
            position: new google.maps.LatLng(this.location.lat, this.location.lng),
            map: this.map,
            icon: icon
        });

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            loader.dismissAll();
        });

    }

}
