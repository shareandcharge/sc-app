import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ViewController, LoadingController, NavParams , AlertController ,ModalController} from 'ionic-angular';
import {AddStationImagePage} from "../add-image/add-image";
import {Platform} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {AuthService} from "../../../services/auth.service";
import {LocationService} from "../../../services/location.service";
import {MyStationsPage} from "../my-stations/my-stations";
import {StationMapDetailPage} from "./station-add-map/map";
import {Location} from "../../../models/location";
import {Station} from "../../../models/station";
import {Connector} from "../../../models/connector";

@Component({
    selector: 'page-add-station',
    templateUrl: 'add-station.html',
    providers: []
})
export class AddStationPage {
    segmentTabs: any;
    autocompleteItems: any;
    autocomplete: any;
    service: any;
    dayHours: any;
    days: any;
    address: any;
    weekdays: any;
    from: any[];
    to: any[];
    descriptions: any;
    problemSolver: any;
    flowMode: any;
    customDays:any;

    locObject: Location;
    station: Station;
    connector: Connector;

    defaultCenterLat = 52.502145;
    defaultCenterLng = 13.414476;

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    placesService: any;
    private platform;
    location: any;
    mapDefaultControlls: boolean;

    defaultZoom = 16;

    constructor(public navCtrl: NavController,private modalCtrl: ModalController ,public locationService: LocationService,private alertCtrl: AlertController ,public auth: AuthService, private loadingCtrl: LoadingController, platform: Platform, navParams: NavParams, private viewCtrl: ViewController) {

        if (typeof navParams.get("mode") != 'undefined') {
            this.flowMode = navParams.get("mode");
        }
        else {
            this.flowMode = "add";
        }

        this.from = [];
        this.to = [];

        this.service = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];

        this.segmentTabs = 'default';

        this.dayHours = [
            {
                "value": 9,
                "title": "9:00"
            },
            {
                "value": 10,
                "title": "10:00"
            },
            {
                "value": 11,
                "title": "11:00"
            },
            {
                "value": 12,
                "title": "12:00"
            },
            {
                "value": 13,
                "title": "13:00"
            },
            {
                "value": 14,
                "title": "14:00"
            },
            {
                "value": 15,
                "title": "15:00"
            },
            {
                "value": 16,
                "title": "16:00"
            },
            {
                "value": 17,
                "title": "17:00"
            },
            {
                "value": 18,
                "title": "18:00"
            },
            {
                "value": 19,
                "title": "19:00"
            }
        ];

        this.weekdays = [];

        this.days = [
            "Montag",
            "Dienstag",
            "Mittwoch",
            "Donnerstag",
            "Freitag",
            "Samstag",
            "Sonntag"
        ];


        this.platform = platform;
        if (this.platform.is("core")) {
            this.mapDefaultControlls = false;
        }
        else {
            this.mapDefaultControlls = true;
        }

        if (typeof navParams.get("location") != 'undefined') {

            console.log("the object is")

            this.locObject = navParams.get("location");
        }
        else{
            // create new location, station and connector
            this.locObject = new Location();

            this.station = new Station();
            this.locObject.stations.push(this.station);

            this.connector = new Connector;
            this.station.connectors.push(this.connector);
        }

        console.log(this.locObject);

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log('Platform ready');
            this.loadMap();

        });
    }

    detailedMap(){
        let modal = this.modalCtrl.create(StationMapDetailPage ,{
            "lat" : this.map.getCenter().lat(),
            "lng" : this.map.getCenter().lng()
        });

        let map = this.map;

        modal.onDidDismiss(location => {
            console.log('DIS:', location);
            let initialLocation = new google.maps.LatLng(location.lat, location.lng);
            map.setCenter(initialLocation);
            //map.clearOverlays();
            //map.setMapOnAll(null);

            new google.maps.Marker({
                draggable: true,
                position: new google.maps.LatLng(location.lat, location.lng),
                map: map
            });

            console.log("update map");
        });

        modal.present();
    }

    updateSearch() {
        if (this.locObject.address == '') {
            this.autocompleteItems = [];
            return;
        }
        let me = this;
        this.service.getPlacePredictions({
            input: this.locObject.address,
            componentRestrictions: {country: 'DE'}
        }, function (predictions, status) {
            me.autocompleteItems = [];
            if (predictions != null) {
                predictions.forEach(function (prediction) {
                    me.autocompleteItems.push(prediction);
                });
            }
        });
    }

    chooseItem(item: any) {
        //console.log('modal > chooseItem > item > ', item);

        this.autocompleteItems = [];

        this.centerToPlace(item);

        this.locObject.address = item.description;
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
                me.map.setZoom(16);

                /*let marker = */new google.maps.Marker({
                    draggable: true,
                    position: place.geometry.location,
                    map: me.map
                });
            }
            else {
                console.log('Place err: ', status);
            }
        }
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
            fullscreenControl: false,
            disableDefaultUI: this.mapDefaultControlls
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        let marker;

        if(this.flowMode == 'add'){
            Geolocation.getCurrentPosition().then((position) => {
                let initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                this.map.setCenter(initialLocation);
                marker = new google.maps.Marker({
                    draggable: true,
                    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    map: this.map
                });

                google.maps.event.addListener(marker, 'dragend', function(evt){
                    this.map.setCenter(marker.position);
                    marker.setMap(this.map);
                });

            }, (err) => {
                console.log(err);
                loader.dismissAll();
            });
        }
        else{
            let initialLocation = new google.maps.LatLng(this.locObject.lat, this.locObject.lng);
            this.map.setCenter(initialLocation);
            marker = new google.maps.Marker({
                draggable: true,
                position: new google.maps.LatLng(this.locObject.lat, this.locObject.lng),
                map: this.map
            });

            google.maps.event.addListener(marker, 'dragend', function(evt){
                this.map.setCenter(marker.position);
                marker.setMap(this.map);
            });
        }


        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            loader.dismissAll();
        });

    }


    ionViewDidLoad() {
        console.log('Hello AddStationPage Page');
    }

    skipAddingStation() {
        this.navCtrl.parent.pop();
    }

    continueAddStation() {
        if (this.flowMode == 'add') {
            let userAddress = "";
            if (this.auth.getUser() != null) {
                userAddress = this.auth.getUser().address;
            }

            this.locObject.owner = userAddress;
            this.locObject.lat = this.map.getCenter().lat();
            this.locObject.lng = this.map.getCenter().lng();
        }
        else {
            this.locObject.lat = this.map.getCenter().lat();
            this.locObject.lng = this.map.getCenter().lng();
        }

        this.navCtrl.push(AddStationImagePage, {
            "location": this.locObject,
            "mode": this.flowMode
        });
    }

    updateSelectedDays() {
        for (let weekday of this.weekdays) {
            this.connector.weekcalendar.hours[weekday].from = +this.from;
            this.connector.weekcalendar.hours[weekday].to = +this.to;
        }
    }

    deleteStation(){
        let alert = this.alertCtrl.create({
            title: 'Löschen bestätigen',
            message: 'Möchten Sie dieses Station wirklich löschen?',
            buttons: [
                {
                    text: 'Nein',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ja, löschen',
                    handler: () => {
                        this.locationService.deleteLocation(this.locObject.id).subscribe(locations => {
                            this.navCtrl.setRoot(MyStationsPage);
                        });
                    }
                }
            ]
        });
        alert.present();
    }
}
