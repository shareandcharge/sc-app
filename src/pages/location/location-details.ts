import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, NavParams , ViewController , Slides , LoadingController , Platform , ModalController} from 'ionic-angular';
import {CarService} from "../../services/car.service";
import {MapDetailPage} from "./details-map/map";
import {AddReviewPage} from "../review/add-review";


@Component({
    selector: 'location-details',
    templateUrl: 'location-details.html',
    providers: [CarService]
})
export class LocationDetailPage {
    location: any;
    slideOptions:any;
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    defaultZoom = 16;
    private platform;
    mapDefaultControlls:boolean;



    constructor(public navCtrl: NavController, private modalCtrl: ModalController,private navParams: NavParams, platform: Platform,  private viewCtrl:ViewController , private loadingCtrl: LoadingController) {

        this.location = navParams.get("location");
        this.platform = platform;
        if(this.platform.is("core")){
            this.mapDefaultControlls = false;
        }
        else{
            this.mapDefaultControlls = true;
        }
        this.slideOptions = {
            initialSlide: 1,
            loop: true
        };
        this.initializeApp();

    }

    ionViewDidLoad() {
    }

/*    itemSelected() {
    }*/

    dismiss(){
        this.viewCtrl.dismiss();
    }

    detailedMap(){
        this.navCtrl.push(MapDetailPage ,{
            "location" : this.location
        });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log('Platform ready');
            this.loadMap();

        });
    }

    feedback(){
        let modal = this.modalCtrl.create(AddReviewPage);
        modal.present();
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
            fullscreenControl: false,
            disableDefaultUI: this.mapDefaultControlls

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
