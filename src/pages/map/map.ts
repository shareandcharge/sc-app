import {Component, ViewChild, ElementRef} from '@angular/core';
import {
    NavController, ModalController, LoadingController, PopoverController, Events,
    FabContainer
} from 'ionic-angular';
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
import {Car} from "../../models/car";
import {Location} from "../../models/location";


declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
    providers: []
})
export class MapPage {

    address;

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    placesService: any;
    private platform;

    defaultCenterLat = 52.5074592;
    defaultCenterLng = 13.2860649;
    defaultZoom = 8;
    currentPositionZoom = 16;
    currentPositionMarker:any;

    mapDefaultControlls: boolean;
    locations: Array<Location>;

    viewType: string;

    visibleLocations = [];

    cars: Car[];
    activeCar: Car;
    activeCarSrc: string;

    constructor(public popoverCtrl: PopoverController, public auth: AuthService, public locationService: LocationService, public carService: CarService, platform: Platform, public navCtrl: NavController, private modalCtrl: ModalController, private loadingCtrl: LoadingController, public events: Events) {
        this.platform = platform;
        this.mapDefaultControlls = !this.platform.is("core");
        this.address = {
            place: ''
        };

        this.viewType = 'map';

        //-- whenever the cars change or user loggs in, refresh the infos we need for the "switch car button"
        this.events.subscribe('cars:updated', () => this.refreshCarInfo());
        this.events.subscribe('auth:login', () => this.refreshCarInfo());
        this.events.subscribe('auth:logout', () => this.refreshCarInfo());

        this.events.subscribe('locations:updated', (location) => this.addMarker(location));

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
        });
    }

    ionViewDidLoad() {
        this.loadMap();
    }

    private refreshCarInfo() {
        let observable = this.carService.getCars();
        observable.subscribe(cars => {
            this.cars = cars;
            this.activeCar = this.carService.getActiveCar();
        }, () => {
            this.cars = null;
            this.activeCar = null;
        });
    }

    hasCars() {
        return this.cars instanceof Array && this.cars.length;
    }

    setActiveCar(car: Car, fab: FabContainer) {
        this.activeCar = car;
        this.carService.setActiveCar(car);
        this.events.publish('cars:updated');
        fab.close();
    }

    centerCurrentPosition() {
        let loader = this.loadingCtrl.create({
            content: "Getting your location ...",
        });
        loader.present();

        Geolocation.getCurrentPosition().then((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.map.setZoom(this.currentPositionZoom);
            this.map.setCenter(latLng);
            this.updateCurrentPositionMarker(latLng);

            loader.dismissAll();
        }, (err) => {
            console.log(err);
            loader.dismissAll();
        });
    }

    updateCurrentPositionMarker(latLng) {
        if (typeof this.currentPositionMarker === 'undefined') {
            let me = this;

            this.currentPositionMarker = new google.maps.Marker({
                map: me.map
            });
        }

        this.currentPositionMarker.setPosition(latLng);
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
        let locDetails = this.modalCtrl.create(LocationDetailPage, {
            "locationId": location.id
        });

        locDetails.present();

        // this.navCtrl.push(LocationDetailPage, {
        //     locationId: location.id
        // });
    }

    // createMarker() {
    //     this.addMarker(this.map.getCenter());
    // }

    addMarker(location: Location) {
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(location.lat, location.lng)
        });

        let me = this;
        marker.addListener('click', function () {
            me.showLocationDetails(location);
            // let locDetails = me.modalCtrl.create(LocationDetailPage, {
            //     "location": location
            // });
            //
            // locDetails.present();

            /*   me.navCtrl.push(LocationDetailPage, {
             "location": location
             });*/
        });

        // let content = location.name;
        // this.addInfoWindow(marker, content);
    }

    gotoMyCars(fab: FabContainer) {
        fab.close();
        this.navCtrl.push(MyCarsPage);
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
                'mode': 'modal'
            });
            modal.present();
        }
    }

    mapSettingsPopOver(e) {
        let popover = this.popoverCtrl.create(MapSettingsPage, {
            map: this.map,
            setViewType: this.setViewType,
            getViewType: this.getViewType
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
