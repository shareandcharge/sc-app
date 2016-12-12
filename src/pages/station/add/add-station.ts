import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ViewController ,LoadingController} from 'ionic-angular';
import {AddStationImagePage} from "../add-image/add-image";
import {Platform} from 'ionic-angular';
import {Geolocation} from 'ionic-native';


@Component({
    selector: 'page-add-station',
    templateUrl: 'add-station.html'
})
export class AddStationPage {
    segmentTabs: any;
    dayHours:any;
    days:any;
    station:any;
    address:any;
    weekdays:any;
    from:any;
    to:any;
    descriptions:any;
    problemSolver:any;

    defaultCenterLat = 52.502145;
    defaultCenterLng = 13.414476;

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    placesService: any;
    private platform;
    location:any;
    mapDefaultControlls:boolean;

    defaultZoom = 16;

    constructor(public navCtrl:NavController, private loadingCtrl: LoadingController ,platform: Platform ,private viewCtrl:ViewController) {

        this.segmentTabs = 'default';

        this.dayHours = [
            {
                "value" : "9",
                "title" : "9:00"
            },
            {
                "value" : "10",
                "title" : "10:00"
            },
            {
                "value" : "11",
                "title" : "11:00"
            },

        ];

        this.weekdays = [
            {
                "text": "Monday",
                "key" : "monday"
            },
            {
                "text": "Tuesday",
                "key" : "tuesday"
            },
            {
                "text": "Wednesday",
                "key" : "wednesday"
            },
            {
                "text": "Thursday",
                "key" : "thursday"
            },
            {
                "text": "Friday",
                "key" : "friday"
            },
            {
                "text": "Saturday",
                "key" : "saturday"
            },
            {
                "text": "Sunday",
                "key" : "sunday"
            }
        ];


        this.days = [
            {
                "text": "Monday",
                "enabled": false,
                "key" : "monday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Tuesday",
                "enabled": false,
                "key" : "tuesday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Wednesday",
                "enabled": false,
                "key" : "wednesday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Thursday",
                "enabled": false,
                "key" : "thursday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Friday",
                "enabled": false,
                "key" : "friday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Saturday",
                "enabled": false,
                "key" : "saturday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Sunday",
                "enabled": false,
                "key" : "sunday",
                "from": "",
                "to" : ""
            }
        ]

        this.platform = platform;
        if(this.platform.is("core")){
            this.mapDefaultControlls = false;
        }
        else{
            this.mapDefaultControlls = true;
        }

        this.initializeApp();

    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log('Platform ready');
            this.loadMap();

        });
    }

    loadMap(){

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

        this.station = {
            "address": this.address,
            "openingHours":
                {
                    "days": this.weekdays,
                    "from": this.from,
                    "to": this.to
                },
            "descriptions": this.descriptions
        };

        this.navCtrl.push(AddStationImagePage);
    }

    updateSelectedDays(e) {

        let me = this;
        this.days.forEach(d => {
            d.enabled = false;
            d.from = "";
            d.to = "";
        });

        e.forEach(wd => {
            this.days.forEach(d => {
                if(wd == d.text){
                    d.enabled = true;
                    d.from = me.from;
                    d.to = me.to;
                }
            });
        });
    }

    updateCustomSelectedDays(e){
        this.weekdays = [];

        this.days.forEach(d => {
            if(d.enabled){
                /*let data = {
                    "text" : d.text,
                };*/
                this.weekdays.push(d.text);
            }
        });
    }
}
