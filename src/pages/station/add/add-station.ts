import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ViewController, LoadingController, NavParams , AlertController} from 'ionic-angular';
import {AddStationImagePage} from "../add-image/add-image";
import {Platform} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {AuthService} from "../../../services/auth.service";
import {LocationService} from "../../../services/location.service";
import {MyStationsPage} from "../my-stations/my-stations"

@Component({
    selector: 'page-add-station',
    templateUrl: 'add-station.html',
    providers: [LocationService]
})
export class AddStationPage {
    segmentTabs: any;
    autocompleteItems: any;
    autocomplete: any;
    service: any;
    dayHours: any;
    days: any;
    locObject: any;
    address: any;
    weekdays: any;
    from: any[];
    to: any[];
    descriptions: any;
    problemSolver: any;
    flowMode: any;
    customDays:any;

    defaultCenterLat = 52.502145;
    defaultCenterLng = 13.414476;

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    placesService: any;
    private platform;
    location: any;
    mapDefaultControlls: boolean;

    defaultZoom = 16;

    constructor(public navCtrl: NavController,public locationService: LocationService,private alertCtrl: AlertController ,public auth: AuthService, private loadingCtrl: LoadingController, platform: Platform, navParams: NavParams, private viewCtrl: ViewController) {

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
                "value": "9",
                "title": "9:00"
            },
            {
                "value": "10",
                "title": "10:00"
            },
            {
                "value": "11",
                "title": "11:00"
            },
            {
                "value": "11",
                "title": "11:00"
            },
            {
                "value": "12",
                "title": "12:00"
            },
            {
                "value": "13",
                "title": "13:00"
            },
            {
                "value": "14",
                "title": "14:00"
            },
            {
                "value": "15",
                "title": "15:00"
            },
            {
                "value": "16",
                "title": "16:00"
            },
            {
                "value": "17",
                "title": "17:00"
            },
            {
                "value": "18",
                "title": "18:00"
            },
            {
                "value": "19",
                "title": "19:00"
            }
        ];

        /*this.weekdays =  [
            {
                "text": "Montag",
                "enabled": false,
                "key": "monday",
                "from": "",
                "to": ""
            },
            {
                "text": "Dienstag",
                "enabled": false,
                "key": "tuesday",
                "from": "",
                "to": ""
            },
            {
                "text": "Mittwoch",
                "enabled": false,
                "key": "wednesday",
                "from": "",
                "to": ""
            },
            {
                "text": "Donnerstag",
                "enabled": false,
                "key": "thursday",
                "from": "",
                "to": ""
            },
            {
                "text": "Freitag",
                "enabled": false,
                "key": "friday",
                "from": "",
                "to": ""
            },
            {
                "text": "Samstag",
                "enabled": false,
                "key": "saturday",
                "from": "",
                "to": ""
            },
            {
                "text": "Sonntag",
                "enabled": false,
                "key": "sunday",
                "from": "",
                "to": ""
            }
        ];*/

        this.customDays = [
            {
                "text": "Monday",
                "enabled": false,
                "key": "monday",
                "from": "",
                "to": ""
            },
            {
                "text": "Tuesday",
                "enabled": false,
                "key": "tuesday",
                "from": "",
                "to": ""
            },
            {
                "text": "Wednesday",
                "enabled": false,
                "key": "wednesday",
                "from": "",
                "to": ""
            },
            {
                "text": "Thursday",
                "enabled": false,
                "key": "thursday",
                "from": "",
                "to": ""
            },
            {
                "text": "Friday",
                "enabled": false,
                "key": "friday",
                "from": "",
                "to": ""
            },
            {
                "text": "Saturday",
                "enabled": false,
                "key": "saturday",
                "from": "",
                "to": ""
            },
            {
                "text": "Sunday",
                "enabled": false,
                "key": "sunday",
                "from": "",
                "to": ""
            }
        ];

        this.weekdays = [];



            /*[
            {
                "text": "Montag",
                "key": "monday"
            },
            {
                "text": "Dienstag",
                "key": "tuesday"
            },
            {
                "text": "Mittwoch",
                "key": "wednesday"
            },
            {
                "text": "Donnerstag",
                "key": "thursday"
            },
            {
                "text": "Freitag",
                "key": "friday"
            },
            {
                "text": "Samstag",
                "key": "saturday"
            },
            {
                "text": "Sonntag",
                "key": "sunday"
            }
        ];*/




        this.days = [
            {
                "text": "Monday",
                "enabled": false,
                "key": "monday",
                "from": "",
                "to": ""
            },
            {
                "text": "Tuesday",
                "enabled": false,
                "key": "tuesday",
                "from": "",
                "to": ""
            },
            {
                "text": "Wednesday",
                "enabled": false,
                "key": "wednesday",
                "from": "",
                "to": ""
            },
            {
                "text": "Thursday",
                "enabled": false,
                "key": "thursday",
                "from": "",
                "to": ""
            },
            {
                "text": "Friday",
                "enabled": false,
                "key": "friday",
                "from": "",
                "to": ""
            },
            {
                "text": "Saturday",
                "enabled": false,
                "key": "saturday",
                "from": "",
                "to": ""
            },
            {
                "text": "Sunday",
                "enabled": false,
                "key": "sunday",
                "from": "",
                "to": ""
            }
        ];


        this.platform = platform;
        if (this.platform.is("core")) {
            this.mapDefaultControlls = false;
        }
        else {
            this.mapDefaultControlls = true;
        }

        if (typeof navParams.get("loc") != 'undefined') {

            this.locObject = navParams.get("loc");
            this.defaultCenterLat = this.locObject.latitude;
            this.defaultCenterLng = this.locObject.longitude;
            this.address = this.locObject.address;
            this.descriptions = this.locObject.descriptions;

            if (typeof this.locObject.stations.openingHours != 'undefined') {
                this.weekdays = this.locObject.stations.openingHours.weekdays;
                this.from = this.locObject.stations.openingHours.from;
                this.to = this.locObject.stations.openingHours.to;
                this.updateSelectedDays();
            }
        }

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log('Platform ready');
            this.loadMap();

        });
    }

    updateSearch() {

        if (this.address == '') {
            this.autocompleteItems = [];
            return;
        }
        let me = this;
        this.service.getPlacePredictions({
            input: this.address,
            componentRestrictions: {country: 'DE'}
        }, function (predictions, status) {
            me.autocompleteItems = [];
            predictions.forEach(function (prediction) {
                me.autocompleteItems.push(prediction);
            });
        });
    }

    chooseItem(item: any) {
        //console.log('modal > chooseItem > item > ', item);

        this.autocompleteItems = [];

        this.centerToPlace(item);

        this.address = item.description;
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

                let marker = new google.maps.Marker({
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

        Geolocation.getCurrentPosition().then((position) => {
            let initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.map.setCenter(initialLocation);
            let marker = new google.maps.Marker({
                draggable: true,
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                map: this.map
            });

            console.log(marker);
        }, (err) => {
            console.log(err);
            loader.dismissAll();
        });


        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            loader.dismissAll();
        });

    }


    ionViewDidLoad() {
        console.log('Hello AddStationPage Page');
    }

    skipAddingStation() {
        this.viewCtrl.dismiss();
    }

    continueAddStation() {


        let openingHours = {
            "weekdays": this.weekdays,
            "from": this.from,
            "to": this.to
        };

        if (this.flowMode == 'add') {
            let userAddress = "";
            if (this.auth.getUser() != null) {
                userAddress = this.auth.getUser().address;
            }
            /*this.weekdays.forEach(wd => {
                openingHours.push(
                    {
                        "text" : wd.text;
                        "key": wd.key;
                        "from" : this.from[];
                    }
                );
            });*/

            this.locObject = {
                "owner": userAddress,
                "address": this.address,
                "latitude": this.map.getCenter().lat(),
                "longitude": this.map.getCenter().lng(),
                "descriptions": this.descriptions,
                "stations": {
                    "openingHours": openingHours,
                    "problemSolver": this.problemSolver
                }
            };
        }
        else {
            this.locObject.address = this.address;
            this.locObject.latitude = this.map.getCenter().lat();
            this.locObject.longitude = this.map.getCenter().lng();
            this.locObject.descriptions = this.descriptions;
            this.locObject.stations.openingHours = openingHours;
            this.locObject.stations.problemSolver = this.problemSolver;
        }

        this.navCtrl.push(AddStationImagePage, {
            "loc": this.locObject,
            "mode": this.flowMode
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    updateSelectedDays() {


        console.log("weekdays model is now " , this.weekdays);
        console.log("from " , this.from);
        console.log("to " , this.to);

        let me = this;
        this.customDays.forEach(d => {
            d.enabled = false;
            d.from = "";
            d.to = "";
        });


        this.weekdays.forEach(wd => {
            this.customDays.forEach(d => {
                if (wd == d.key) {
                    d.enabled = true;
                    d.from = me.from;
                    d.to = me.to;
                }
            });
        });
    }

    updateCustomSelectedDays(e) {
        this.weekdays = [];
        this.from = [];
        this.to = [];

        this.customDays.forEach(d => {
            if (d.enabled) {
                /*let data = {
                 "text" : d.text,
                 };*/
                this.from.push(d.from);
                this.to.push(d.to);
                this.weekdays.push(d.key);
            }
        });

        console.log("weekdays model is now " , this.weekdays);
        console.log("from " , this.from);
        console.log("to " , this.to);

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
