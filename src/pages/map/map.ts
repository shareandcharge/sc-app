import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ModalController, LoadingController, PopoverController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {Platform} from 'ionic-angular';
import {AutocompletePage} from './autocomplete';
import {MapSettingsPage} from '../map-settings/map-settings';


declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {

    /*constructor(public navCtrl: NavController) {

     }*/

    address;

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    placesService: any;
    private platform;

    defaultCenterLat = 51.6054624;
    defaultCenterLng = 10.6679155;
    defaultZoom = 7;
    currentPositionZoom = 13;

    constructor(public popoverCtrl: PopoverController, platform: Platform, public navCtrl: NavController, private modalCtrl: ModalController, private loadingCtrl: LoadingController) {
        this.platform = platform;

        this.address = {
            place: ''
        };

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log('Platform ready');
        });
    }

    ionViewDidLoad() {
        console.log("view loaded.");
        this.loadMap();
    }

    /*ionViewLoaded(){
     this.loadMap();
     }*/

    centerCurrentPosition() {
        Geolocation.getCurrentPosition().then((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.map.setZoom(this.currentPositionZoom);
            this.map.setCenter(latLng);
        }, (err) => {
            console.log(err);
        });
    }

    loadMap() {
        let loader = this.loadingCtrl.create({
            content: "Loading map ...",
        });
        loader.present();

        let latLng = new google.maps.LatLng(this.defaultCenterLat, this.defaultCenterLng);

        let mapOptions = {
            center: latLng,
            zoom: this.defaultZoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            fullscreenControl: false
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMapCenterControl();
        this.addMapFilterControl();

        console.log("map elem:", this.mapElement.nativeElement);

        let me = this;

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            me.addDummyMarkers();
            loader.dismissAll();
        });
    }

    createMarker() {
        this.addMarker(this.map.getCenter());
    }

    addMarker(position) {
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: position
        });

        let content = "<b>Station:</b> " + position.lat() + ', ' + position.lng();

        this.addInfoWindow(marker, content);
    }


    mapSettingsPopOver(e) {
        let popover = this.popoverCtrl.create(MapSettingsPage, {
            map: this.map
        });

        popover.present({
            ev: e
        });
    }

    addDummyMarkers() {
        let dummys = [
            {'lat': 52.58363603, 'lng': 11.53619477},
            {'lat': 52.71166356, 'lng': 9.95521968},
            {'lat': 51.38227646, 'lng': 9.69326227},
            {'lat': 49.53745409, 'lng': 10.1372128},
            {'lat': 49.795868, 'lng': 12.16748952},
            {'lat': 51.01381809, 'lng': 7.87189239},
            {'lat': 50.59631641, 'lng': 8.84209567},
            {'lat': 51.19280834, 'lng': 13.2600554},
            {'lat': 50.51676003, 'lng': 9.85862289},
            {'lat': 50.64257946, 'lng': 12.21387494}
        ];

        let me = this;
        dummys.forEach(function (pos) {
            me.addMarker(new google.maps.LatLng(pos.lat, pos.lng));
        });
    }

    addInfoWindow(marker, content) {

        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }

    showAddressModal() {
        let modal = this.modalCtrl.create(AutocompletePage);
        modal.onDidDismiss(place => {
            console.log('DATA:', place);
            this.address.place = place;
            this.centerToPlace(place);
        });
        modal.present();
    }

    centerToPlace(place) {
        let request = {
            placeId: place.place_id
        };
        console.log('Place request: ', request);
        this.placesService = new google.maps.places.PlacesService(this.map);
        this.placesService.getDetails(request, callback);

        let me = this;

        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log('Place detail:', place);
                me.map.setCenter(place.geometry.location);
            }
            else {
                console.log('Place err: ', status);
            }
        }
    }

    addMapCenterControl() {
        var centerControlDiv = document.createElement('div');

        var controlUI = document.createElement('div');
        controlUI.id = 'mapCenterUI';
        centerControlDiv.appendChild(controlUI);


        var controlText = document.createElement('div');
        controlText.id = 'mapCenterText';
        controlText.innerHTML = '<ion-icon name="md-locate" role="img" class="icon icon-md ion-md-locate" aria-label="locate" ng-reflect-name="md-locate"></ion-icon>';
        controlUI.appendChild(controlText);

        let me = this;

        controlUI.addEventListener('click', function () {
            me.centerCurrentPosition();
        });

        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv);
    }

    addMapFilterControl() {
        var centerControlDiv = document.createElement('div');

        var controlUI = document.createElement('div');
        controlUI.id = 'mapFilterUI';
        centerControlDiv.appendChild(controlUI);


        var controlText = document.createElement('div');
        controlText.id = 'mapFilterText';
        controlText.innerHTML = '<ion-icon name="filter" role="img" class="icon icon-ios ion-ios-funnel" aria-label="filter" ng-reflect-name="filter"></ion-icon>';
        controlUI.appendChild(controlText);

        let me = this;

        controlUI.addEventListener('click', function () {
            // me.openFilter()
        });

        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv);
    }
}
