import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ModalController, LoadingController, PopoverController , NavParams , ViewController} from 'ionic-angular';
import {Platform} from 'ionic-angular';


declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class StationMapDetailPage {

    /*constructor(public navCtrl: NavController) {

     }*/

    address;

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    placesService: any;
    private platform;
    location:any;
    mapDefaultControlls:boolean;
    lat:any;
    lng:any;

    defaultZoom = 16;

    constructor(public popoverCtrl: PopoverController,private viewCtrl : ViewController , platform: Platform,private navParams: NavParams ,public navCtrl: NavController, private modalCtrl: ModalController, private loadingCtrl: LoadingController) {
        this.platform = platform;

        if(this.platform.is("core")){
            this.mapDefaultControlls = false;
        }
        else{
            this.mapDefaultControlls = true;
        }
        
        this.lat = navParams.get("lat");
        this.lng = navParams.get("lng");
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

        let latLng = new google.maps.LatLng(this.lat, this.lng);

        let mapOptions = {
            center: latLng,
            zoom: this.defaultZoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            fullscreenControl: false,
            disableDefaultUI: this.mapDefaultControlls
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.lat, this.lng),
            draggable: true,
            map: this.map
        });

        let me= this;

        google.maps.event.addListener(marker, 'dragend', function(evt){
            console.log('Marker dropped: Current Lat: ' + evt.latLng.lat() + ' Current Lng: ' + evt.latLng.lng() );
            me.lat = evt.latLng.lat();
            me.lng = evt.latLng.lng();

            me.map.setCenter(marker.position);
            marker.setMap(me.map);
        });

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            loader.dismissAll();
        });
    }

    dismiss(){

        let location = {
            "lat" : this.lat,
            "lng" : this.lng
        };
        console.log('Before dismiss:', location);
        this.viewCtrl.dismiss(location);
    }

}
