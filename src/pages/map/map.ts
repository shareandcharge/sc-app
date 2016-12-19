import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ModalController, LoadingController, PopoverController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {Platform} from 'ionic-angular';
import {AutocompletePage} from './autocomplete/autocomplete';
import {MapSettingsPage} from './settings/map-settings';
import {MapFilterPage} from './filter/filter';
import {LocationDetailPage} from '../location/location-details';
import {MyCarsPage} from '../car/my-cars/my-cars';
import {AuthService} from "../../services/auth.service";
import {LoginPage} from "../login/login";
import {LocationService} from "../../services/location.service";
import {CarService} from "../../services/car.service";
import {CarWrapperPage} from "../car/car-wrapper";


declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
    providers: [LocationService, CarService]
})
export class MapPage {

    address;

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    placesService: any;
    private platform;

    defaultCenterLat = 51.6054624;
    defaultCenterLng = 10.6679155;
    defaultZoom = 8;
    currentPositionZoom = 16;
    mapDefaultControlls:boolean;
    locations:any;

    viewType:string;

    visibleLocations = [];

    constructor(public popoverCtrl: PopoverController,public auth: AuthService, public locationService: LocationService, public carService: CarService, platform: Platform, public navCtrl: NavController, private modalCtrl: ModalController, private loadingCtrl: LoadingController) {
        this.platform = platform;
        if(this.platform.is("core")){
            this.mapDefaultControlls = false;
        }
        else{
            this.mapDefaultControlls = true;
        }

        this.address = {
            place: ''
        };

        this.viewType = 'map';

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
        let loader = this.loadingCtrl.create({
            content: "Getting your location ...",
        });
        loader.present();

        Geolocation.getCurrentPosition().then((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.map.setZoom(this.currentPositionZoom);
            this.map.setCenter(latLng);
            loader.dismissAll();
        }, (err) => {
            console.log(err);
            loader.dismissAll();
        });
    }

    setViewType = (viewType) => {
        if (viewType === 'list') {
            let me = this;

            var bounds = {
                latFrom: 0,
                latTo: 0,
                lngFrom: 0,
                lngTo: 0
            };

            var googleBounds = me.map.getBounds();

            bounds.latFrom = googleBounds.getSouthWest().lat();
            bounds.latTo = googleBounds.getNorthEast().lat();
            bounds.lngFrom = googleBounds.getSouthWest().lng();
            bounds.lngTo = googleBounds.getNorthEast().lng();

            me.locationService.searchLocations(bounds).subscribe(locations => {
                me.visibleLocations = locations;
                this.viewType = viewType;
            });
        } else {
            this.viewType = viewType;
        }
    };

    getViewType = () => {
        return this.viewType;
    };

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
            fullscreenControl: false,
            disableDefaultUI: this.mapDefaultControlls
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMapCenterControl();
        this.addMapFilterControl();

        let me = this;

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            me.addLocationMarkers();
            loader.dismissAll();
        });


    }


    showLocationDetails(location) {
        this.navCtrl.push(LocationDetailPage, {
            location : location
        });
    }
    // createMarker() {
    //     this.addMarker(this.map.getCenter());
    // }

    addMarker(location) {
        console.log('ADD MARKER: ', location);
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(location.latitude, location.longitude)
        });

        let me = this;
        marker.addListener('click', function () {
            let locDetails = me.modalCtrl.create(LocationDetailPage , {
                "location": location
            });

            locDetails.present();

         /*   me.navCtrl.push(LocationDetailPage, {
                "location": location
            });*/
        });

        // let content = location.name;
        // this.addInfoWindow(marker, content);
    }

    myCarsModal() {
        if(this.auth.loggedIn()){
            this.navCtrl.push(MyCarsPage);
        }
        else{
            this.navCtrl.setRoot(LoginPage , {
                "dest" : MyCarsPage
            });
        }
    }

    addCarModal() {
        if (this.auth.loggedIn()) {
            let modal = this.modalCtrl.create(CarWrapperPage, {
                "mode": "enter"
            });
            modal.present();
        }
        else {
            let modal = this.modalCtrl.create(LoginPage, {
                "dest": CarWrapperPage,
                'mode' : 'modal'
            });
            modal.present();
        }
    }

    hasCars() {
        return false;
        // this.carService.getCars().subscribe(cars => {
        //     return cars.length > 0;
        // })
    }

    mapSettingsPopOver(e) {
        let popover = this.popoverCtrl.create(MapSettingsPage, {
            map: this.map,
            setViewType : this.setViewType,
            getViewType : this.getViewType
        });

        popover.present({
            ev: e
        });
    }


    addInfoWindow(marker, content) {

        let infoWindow = new google.maps.InfoWindow({
            content: content,
            enableEventPropagation: true
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }

    presentFilterModal() {
        let filter = this.modalCtrl.create(MapFilterPage);
        filter.present();
    }

    showAddressModal() {
        let modal = this.modalCtrl.create(AutocompletePage);
        modal.onDidDismiss(place => {

            if (place) {
                console.log('DATA:', place);
                this.viewType = 'map';
                this.address.place = place;
                this.centerToPlace(place);
            }
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
                me.map.setZoom(me.currentPositionZoom);
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

        this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
    }

    addMapFilterControl() {
        var centerControlDiv = document.createElement('div');

        var controlUI = document.createElement('div');
        controlUI.id = 'mapFilterUI';
        centerControlDiv.appendChild(controlUI);


        var controlText = document.createElement('div');
        controlText.id = 'mapFilterText';
        controlText.innerHTML = '<ion-icon name="filter" role="img" class="icon icon-ios ion-ios-options" aria-label="filter" ng-reflect-name="filter"></ion-icon>';
        controlUI.appendChild(controlText);

        let me = this;

        controlUI.addEventListener('click', function () {
            me.presentFilterModal()
        });

        this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
    }

    addLocationMarkers() {
        this.locationService.getLocations().subscribe(locations => {
            this.locations = locations;
            let me = this;
            this.locations.forEach(function (location) {
                me.addMarker(location);
            });
        });
    }
}
