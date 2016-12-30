import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, NavParams, ViewController, LoadingController, Platform, ModalController} from 'ionic-angular';
import {MapDetailPage} from "./details-map/map";
import {AddRatingPage} from "../rating/add-rating";
import {AuthService} from "../../services/auth.service";
import {RatingService} from "../../services/rating.service";
import {Rating} from "../../models/rating";
import {LocationService} from "../../services/location.service";
import {Location} from "../../models/location";
import {LaunchNavigator, LaunchNavigatorOptions} from 'ionic-native';

@Component({
    selector: 'location-details',
    templateUrl: 'location-details.html',
    providers: []
})
export class LocationDetailPage {
    location: Location;
    slideOptions: any;
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    defaultZoom = 16;

    showMapDefaultControlls: boolean;
    ratings: Array<Rating> = [];

    showOpeningHours: boolean = false;

    isDesktop: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isWindows: boolean;

    private locationId: number;

    constructor(private navCtrl: NavController, private modalCtrl: ModalController, private navParams: NavParams, platform: Platform, private viewCtrl: ViewController, private loadingCtrl: LoadingController, private authService: AuthService, public ratingService: RatingService, private locationService: LocationService) {

        this.location = new Location();
        this.locationId = navParams.get("locationId");

        console.log(this.locationId);

        this.isDesktop = platform.is("core");
        this.isIOS = platform.is("ios");
        this.isAndroid = platform.is("android");
        this.isWindows = platform.is("windows");

        this.showMapDefaultControlls = !this.isDesktop;

        this.slideOptions = {
            initialSlide: 1,
            loop: true
        };
    }

    ionViewWillEnter() {
        this.getLocationDetail();
    }

    ionViewDidLoad() {
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    detailedMap() {
        this.navCtrl.push(MapDetailPage, {
            "location": this.location
        });
    }

    feedback() {
        let modal = this.modalCtrl.create(AddRatingPage, {
            'location': this.location
        });
        modal.present();
    }

    getLocationDetail() {
        let observable = this.locationService.getLocation(this.locationId);
        observable.subscribe(
            location => {
                this.location = location;
                this.loadMap();
                this.getRatings();
            }
        );
        return observable;
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

        // let loader = this.loadingCtrl.create({
        //     content: "Loading map ...",
        // });
        // loader.present();

        let latLng = new google.maps.LatLng(this.location.lat, this.location.lng);

        let mapOptions = {
            center: latLng,
            zoom: this.defaultZoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            fullscreenControl: false,
            disableDefaultUI: this.showMapDefaultControlls

        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.location.lat, this.location.lng),
            map: this.map
        });

        console.log(marker);

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            // loader.dismissAll();
        });

    }

    openMapsApp() {
        if (this.isDesktop) {
            let coords = this.location.lat + "," + this.location.lng;
            window.open("http://maps.google.com/?q=" + coords, '_system');
        }
        else {
            let options: LaunchNavigatorOptions = {
                appSelectionDialogHeader: 'App auswählen',
                appSelectionCancelButton: 'Abbrechen'
            };
            LaunchNavigator.navigate([this.location.lat, this.location.lng], options)
                .then(
                    success => console.log('map app launched'),
                    error => alert('App konnte nicht gestartet werden: ' + error)
                );
        }
    }
}
