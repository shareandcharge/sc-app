import {Component, ViewChild, ElementRef, NgZone} from '@angular/core';
import {
    NavController, ModalController, LoadingController, PopoverController, Events,
    FabContainer, ToastController, App
} from 'ionic-angular';
import {Geolocation, InAppBrowser} from 'ionic-native';
import {Platform} from 'ionic-angular';
import {MapSettingsPage} from './settings/map-settings';
import {FilterWrapperPage} from './filter/filter-wrapper';
import {LocationDetailPage} from '../location/location-details';
import {MyCarsPage} from '../car/my-cars/my-cars';
import {AuthService} from "../../services/auth.service";
import {LocationService} from "../../services/location.service";
import {CarService} from "../../services/car.service";
import {CarWrapperPage} from "../car/car-wrapper";
import {Car} from "../../models/car";
import {Location} from "../../models/location";
import {ChargingService} from '../../services/charging.service';
import {SignupLoginPage} from "../signup-login/signup-login";
import {ErrorService} from "../../services/error.service";
import * as MarkerClusterer from 'node-js-marker-clusterer';
import {TranslateService} from "@ngx-translate/core";

declare var google: any;
declare var cordova: any;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
    providers: []
})
export class MapPage {

    address;

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    markerClusterer: any;
    placesService: any;
    private platform;

    defaultCenterLat = 51.579002;
    defaultCenterLng = 7.1207889;
    defaultZoom = 7;
    currentLatLng: any;
    currentPositionZoom = 16;
    currentPositionOverlay: any;

    locationMarkers: Array<any>;

    mapDefaultControlls: boolean;

    //-- "short" because we only request a limited set of fields to keep it small
    //      so be aware that this is not a full featured/filled location object!
    locationFields: string = 'id,available,open,matchesPlugtype,lat,lng,id,address';
    locationsShort: Array<Location>;

    currentLocationLoading: boolean = false;

    viewType: string;

    visibleLocations = [];

    cars: Car[];
    activeCar: Car;
    isCharging: boolean;

    filterForPlugs: Array<number>;
    filterForCommercialCategory: Array<number>;
    chargingProgress: number;

    searchMode: boolean = false;

    autocompleteItems: any;
    autocompleteService: any;

    elemFilterControl: any;

    constructor(public popoverCtrl: PopoverController, public auth: AuthService, public locationService: LocationService,
                public carService: CarService, platform: Platform, public navCtrl: NavController,
                private modalCtrl: ModalController, private loadingCtrl: LoadingController, public events: Events,
                private chargingService: ChargingService, private zone: NgZone, private errorService: ErrorService,
                private toastCtrl: ToastController, private translateService: TranslateService, private app: App) {
        this.platform = platform;
        this.mapDefaultControlls = !this.platform.is("core");
        this.address = {
            place: ''
        };

        this.locationMarkers = [];
        this.viewType = 'map';

        this.filterForPlugs = [];
        this.filterForCommercialCategory = [];
        this.chargingProgress = this.chargingService.getChargingProgress();

        this.autocompleteService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
    }

    ionViewDidLoad() {
        this.loadMap();
    }

    mapLoaded() {
        //-- add the subscribers after the map is ready

        //-- whenever the cars change or user loggs in, refresh the infos we need for the "switch car button"
        this.events.subscribe('cars:updated', () => this.refreshCarInfo());
        this.events.subscribe('user:refreshed', () => this.refreshCarInfo());
        this.events.subscribe('auth:login', () => this.refreshCarInfo());
        this.events.subscribe('auth:logout', () => {
            this.filterForPlugs = [];
            this.filterForCommercialCategory = [];
            this.refreshCarInfo();
        });

        this.events.subscribe('locations:updated', (location) => this.refreshLocations());

        this.refreshCarInfo();      // also refreshes locations
    }

    ionViewDidEnter() {
        this.isCharging = this.chargingService.isCharging();
        if (this.map) {
            //-- we had issues of messed up map views when reopening the app
            //      this (may) fix it
            google.maps.event.trigger(this.map, 'resize');
        }

        /**
         * We had timing problems with ionic setting the browser title from
         * <ion-title> before it was translated/before translations were loaded.
         * That's why we set the title here by hand after translation are loaded.
         * We use "stream" instead of "get" because at least for FF timing
         * was still an issue with get; so it had to do with setting/changing the lang.
         * That's probably only an issue for the first view to be loaded.
         */
        this.translateService.stream('map.title').subscribe((res: string) => {
            this.app.setTitle(res);
        });
    }

    private refreshCarInfo() {
        let observable = this.carService.getCars();
        observable.subscribe(cars => {
            this.cars = cars;
            this.activeCar = this.carService.getActiveCar();
            this.isCharging = this.chargingService.isCharging();

            if (this.activeCar != null) {
                this.filterForPlugs = this.activeCar.plugTypes;
            }

            this.refreshLocations();
        }, (error) => {
            this.errorService.displayErrorWithKey(error, this.translateService.instant('map.list_cars'));
            this.cars = null;
            this.activeCar = null;
        });

        return observable;
    }

    hasCars() {
        return this.cars instanceof Array && this.cars.length;
    }

    setActiveCar(car: Car, fab: FabContainer) {
        this.carService.selectAsActiveCar(car).subscribe((response) => {
                this.activeCar = car;
                this.events.publish('cars:updated');
            },
            error => this.errorService.displayErrorWithKey(error, this.translateService.instant('map.switch_car')));


        fab.close();
    }

    initializeCurrentPositionOverlay() {
        let me = this;
        let currentPositionDiv = null;

        this.currentPositionOverlay = new google.maps.OverlayView();

        this.currentPositionOverlay.onAdd = function () {
            currentPositionDiv = document.createElement('div');
            currentPositionDiv.id = 'currentPosition';
            currentPositionDiv.style.position = 'absolute';

            let panes = this.getPanes();
            panes.overlayLayer.appendChild(currentPositionDiv);
        };

        this.currentPositionOverlay.draw = function () {
            let point = this.getProjection().fromLatLngToDivPixel(me.currentLatLng);

            if (point) {
                currentPositionDiv.style.left = (point.x - 10) + 'px';
                currentPositionDiv.style.top = (point.y - 10) + 'px';
            }
        };

        this.currentPositionOverlay.onRemove = function () {
            currentPositionDiv.parentNode.removeChild(currentPositionDiv);
            currentPositionDiv = null;
        };

        this.currentPositionOverlay.setMap(this.map);
    }

    centerCurrentPosition() {
        if (this.currentLocationLoading) return;

        let timeout = 10000;

        let toast = this.toastCtrl.create({
            message: this.translateService.instant('map.message_determine_location'),
            position: "top",
            dismissOnPageChange: true,
            duration: timeout,
            showCloseButton: true,
            closeButtonText: 'X'
        });

        toast.present();
        this.currentLocationLoading = true;

        let options = {
            maximumAge: 0, timeout: timeout, enableHighAccuracy: true
        };

        Geolocation.getCurrentPosition(options).then((position) => {
            this.currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.map.setZoom(this.currentPositionZoom);
            this.map.setCenter(this.currentLatLng);

            if (typeof this.currentPositionOverlay === 'undefined') {
                this.initializeCurrentPositionOverlay();
            }
            this.currentLocationLoading = false;

            toast.dismiss();
        }, (err) => {
            toast.dismiss();
            this.errorService.displayError(this.translateService.instant('map.error_no_location'));

            this.currentLocationLoading = false;
        });
    }

    setViewType = (viewType) => {
        if (viewType === 'list') {
            let me = this;

            let bounds = {
                latFrom: 0,
                latTo: 0,
                lngFrom: 0,
                lngTo: 0
            };

            let googleBounds = me.map.getBounds();

            bounds.latFrom = googleBounds.getSouthWest().lat();
            bounds.latTo = googleBounds.getNorthEast().lat();
            bounds.lngFrom = googleBounds.getSouthWest().lng();
            bounds.lngTo = googleBounds.getNorthEast().lng();

            me.locationService.searchLocations(bounds, this.filterForPlugs, this.locationFields).subscribe(locations => {
                    me.visibleLocations = locations;
                    this.viewType = viewType;
                },
                error => this.errorService.displayErrorWithKey(error, this.translateService.instant('map.search_location')));
        } else {
            this.viewType = viewType;
        }
    };

    getViewType = () => {
        return this.viewType;
    };


    loadMap() {
        let loader = this.loadingCtrl.create({
            // content: this.translateService.instant('map.loading_map'),
        });
        loader.present();

        let options = {
            maximumAge: 0, timeout: 10000, enableHighAccuracy: true
        };

        let latLng = new google.maps.LatLng(this.defaultCenterLat, this.defaultCenterLng);

        Geolocation.getCurrentPosition(options).then((position) => {
            latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            return latLng;
        }, (err) => {
            return latLng;
        }).then((latLng) => {
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
                // add event listener to all a-tags of the map and use inAppBrowser to open them
                let aTags = me.mapElement.nativeElement.getElementsByTagName('A');
                let closeTrans = me.translateService.instant('common.close');

                for (let aTag of aTags) {
                    if (aTag.href === '') {
                        continue;
                    }

                    aTag.addEventListener('click', (event) => {
                        event.preventDefault();
                        new InAppBrowser(aTag.href, '_blank', 'presentationstyle=fullscreen,closebuttoncaption=' + closeTrans + ',toolbar=yes,location=yes');
                        return false;
                    });
                }

                me.mapLoaded();
                loader.dismissAll();
            });
        });
    }

    refreshLocations() {
        this.deactivateFilterControl();

        let params = {
            fields: this.locationFields
        };

        if (Array.isArray(this.filterForPlugs) && this.filterForPlugs.length > 0) {
            params['plugType'] = this.filterForPlugs.join(',');
        }

        if (Array.isArray(this.filterForCommercialCategory) && this.filterForCommercialCategory.length > 0) {
            /* the backend expects it lowercase ! */
            params['commercialcategory'] = this.filterForCommercialCategory.join(',');
        }

        this.locationService.getLocations(params).subscribe(locations => {
                this.locationsShort = locations;
                if (this.filterForPlugs.length > 0 || this.filterForCommercialCategory.length > 0) {
                    this.activateFilterControl();
                }
                this.updateLocationMarkers();
            },
            error => this.errorService.displayErrorWithKey(error, this.translateService.instant('map.load_station')));
    }

    showLocationDetails(location) {
        let locDetails = this.modalCtrl.create(LocationDetailPage, {
            "locationId": location.id
        });
        locDetails.present();
    }

    addMarker(location: Location) {
        let image = this.locationService.isBusy(location) ? 'busy.png' : 'available.png';
        let icon = `assets/icons/marker/${image}`;
        let marker = new google.maps.Marker({
            map: this.map,
            icon: icon,
            // animation: google.maps.Animation.DROP,   // don't turn that on. It slows everything down!
            position: new google.maps.LatLng(location.lat, location.lng)
        });

        let me = this;
        marker.addListener('click', function () {
            me.showLocationDetails(location);
        });

        this.locationMarkers.push(marker);
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
            let modal = this.modalCtrl.create(SignupLoginPage, {
                "dest": CarWrapperPage,
                'mode': 'modal',
                'action': 'login',
                'trackReferrer': 'Map add car'
            });
            modal.present();
        }
    }

    mapSettingsOpen() {
        let settings = this.modalCtrl.create(MapSettingsPage, {
            map: this.map,
            setViewType: this.setViewType,
            getViewType: this.getViewType
        });

        settings.present();

        settings.onDidDismiss((data?) => {
            if (data && data.action) {
                switch (data.action) {
                    case 'refresh':
                        this.refreshLocations();
                        break;
                }
            }
        });
    }

    presentFilterModal() {
        // convert string ids to numbers
        this.filterForPlugs = this.filterForPlugs.map((i) => +i);
        this.filterForCommercialCategory = this.filterForCommercialCategory.map((i) => +i);

        let filter = this.modalCtrl.create(FilterWrapperPage, {
            toggledPlugs: this.filterForPlugs,
            filterForCommercialCategory: this.filterForCommercialCategory,
            setFilter: this.setFilter
        });
        filter.present();
    }

    setFilter = (plugTypes, commercialCategories) => {
        this.filterForPlugs = plugTypes;
        this.filterForCommercialCategory = commercialCategories;

        this.refreshLocations();
    };

    activateFilterControl() {
        this.deactivateFilterControl(); // to avoid duplicate additions
        this.elemFilterControl.className = this.elemFilterControl.className + ' active';
    }

    deactivateFilterControl() {
        this.elemFilterControl.className = this.elemFilterControl.className.replace(' active', '');
    }


    centerToPlace(place) {
        let request = {
            placeId: place.place_id
        };

        this.placesService = new google.maps.places.PlacesService(this.map);
        this.placesService.getDetails(request, callback);

        let me = this;

        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                me.map.setCenter(place.geometry.location);
                me.map.setZoom(me.currentPositionZoom);
            }
            else {
                // console.log('Place err: ', status);
            }
        }
    }

    addMapCenterControl() {
        let centerControlDiv = document.createElement('div');

        let controlUI = document.createElement('div');
        controlUI.id = 'mapCenterUI';
        centerControlDiv.appendChild(controlUI);


        let controlText = document.createElement('div');
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
        // this.elemFilterControl
        let mapControl = document.createElement('div');

        this.elemFilterControl = document.createElement('div');
        this.elemFilterControl.id = 'mapFilterUI';
        // mapControl.appendChild(this.elemFilterControl);


        // let controlText = document.createElement('div');
        // controlText.id = 'mapFilterText';
        // controlText.innerHTML = '<ion-icon name="filter" role="img" class="icon icon-ios ion-ios-options" aria-label="filter" ng-reflect-name="filter"></ion-icon>';
        // this.elemFilterControl.appendChild(controlText);

        let me = this;

        this.elemFilterControl.addEventListener('click', function () {
            me.presentFilterModal()
        });

        this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(mapControl);
    }

    updateLocationMarkers() {
        if (this.locationMarkers.length) {
            this.locationMarkers.forEach(marker => marker.setMap(null));
            this.locationMarkers = [];
        }
        if (this.markerClusterer) {
            this.markerClusterer.clearMarkers();
        }

        this.locationsShort.forEach(location => this.addMarker(location));

        this.markerClusterer = new MarkerClusterer(this.map, this.locationMarkers, {
            gridSize: 40,
            maxZoom: 12,
            imagePath: 'assets/icons/marker/cluster'
        });
    }

    setSearchMode(mode: boolean) {
        if (mode) {
            this.searchMode = true;
        } else {
            this.searchMode = false;
            this.autocompleteItems = [];
        }
    }

    chooseItem(item: any) {
        try {
            cordova.plugins.Keyboard.close();
        }
        catch (e) {
            // console.log('Hiding keyboard, browser');
        }

        this.autocompleteItems = [];

        this.address.place = item;
        this.centerToPlace(item);

        this.searchMode = false;
    }

    updateSearch(ev: any) {
        let val = ev.target.value;

        if (!val || val.trim() == '') {
            this.autocompleteItems = [];
            return;
        }

        this.autocompleteService.getPlacePredictions({
            input: val,
        }, (predictions, status) => {
            let places = [];

            if ('OK' === status) {
                predictions.forEach(function (prediction) {
                    places.push(prediction);
                });
            }

            this.zone.run(() => {
                this.autocompleteItems = places;
            });
        });
    }
}
