import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, NavParams, ViewController, LoadingController, Platform, ModalController} from 'ionic-angular';
import {MapDetailPage} from "./details-map/map";
import {AddRatingPage} from "../rating/add-rating";
import {AuthService} from "../../services/auth.service";
import {RatingService} from "../../services/rating.service";
import {Rating} from "../../models/rating";


@Component({
    selector: 'location-details',
    templateUrl: 'location-details.html',
    providers: []
})
export class LocationDetailPage {
    location: any;
    slideOptions: any;
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    defaultZoom = 16;
    private platform;
    mapDefaultControlls: boolean;
    ratings: Array<Rating> = [];

    showOpeningHours: boolean = false;


    constructor(public navCtrl: NavController, private modalCtrl: ModalController, private navParams: NavParams, platform: Platform, private viewCtrl: ViewController, private loadingCtrl: LoadingController, public authService: AuthService, public ratingService: RatingService) {

        this.location = navParams.get("location");
        this.platform = platform;
        if (this.platform.is("core")) {
            this.mapDefaultControlls = false;
        }
        else {
            this.mapDefaultControlls = true;
        }
        this.slideOptions = {
            initialSlide: 1,
            loop: true
        };

        this.initializeApp();

    }

    ionViewWillEnter() {
        this.getRatings();
    }

    ionViewDidLoad() {
    }

    /*    itemSelected() {
     }*/

    dismiss() {
        this.viewCtrl.dismiss();
    }

    detailedMap() {
        this.navCtrl.push(MapDetailPage, {
            "location": this.location
        });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log('Platform ready');
            this.loadMap();

        });
    }

    feedback() {
        let modal = this.modalCtrl.create(AddRatingPage, {
            'location' : this.location
        });
        modal.present();
    }

    getRatings() {
        let observable = this.ratingService.getRatings(this.location.id);
        observable.subscribe(
            ratings => this.ratings = ratings
        );
    }

    fullStars(value: number): Array<number> {
        return Array(Math.floor(value));
    }

    displayHalfStars(value: number): boolean {
        return Math.floor(value) != value;
    }

    emptyStars(value: number): Array<number> {
        return Array(5 - Math.ceil(value));
    }

    loadMap() {

        console.log("loading the map");
        // let loader = this.loadingCtrl.create({
        //     content: "Loading map ...",
        // });
        // loader.present();

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

        console.log(marker);

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            // loader.dismissAll();
        });

    }

}
