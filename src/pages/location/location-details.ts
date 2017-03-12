import {Component, ViewChild, ElementRef} from '@angular/core';
import {
    NavParams, ViewController, Platform, ModalController, AlertController
} from 'ionic-angular';
import {MapDetailPage} from "./details-map/map";
import {AddRatingPage} from "../rating/add-rating";
import {AuthService} from "../../services/auth.service";
import {RatingService} from "../../services/rating.service";
import {Rating} from "../../models/rating";
import {LocationService} from "../../services/location.service";
import {Location} from "../../models/location";
import {LaunchNavigator, LaunchNavigatorOptions} from 'ionic-native';
import {ChargingPage} from './charging/charging';
import {ChargingService} from '../../services/charging.service';
import {Connector} from "../../models/connector";
import {Station} from "../../models/station";
import {ConfigService} from "../../services/config.service";
import {DomSanitizer} from "@angular/platform-browser";
import {CarService} from "../../services/car.service";
import {SignupLoginPage} from "../signup-login/signup-login";
import {ErrorService} from "../../services/error.service";
import {ChargingCompletePage} from './charging/charging-complete/charging-complete'


@Component({
    selector: 'location-details',
    templateUrl: 'location-details.html',
    providers: []
})
export class LocationDetailPage {
    location: Location;
    station: Station;
    connector: Connector;

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

    charging: boolean;

    weekdays: any;

    plugTypes: any;
    plugSvg: any;

    openingHours: any;
    today: number;

    averageRating: number;

    minPrice: any;
    maxPrice: any;
    includingVat: boolean;
    flatrateTariff: boolean;

    constructor(private alertCtrl: AlertController, private modalCtrl: ModalController, private chargingService: ChargingService, private navParams: NavParams, platform: Platform, private viewCtrl: ViewController, private authService: AuthService, public ratingService: RatingService, private locationService: LocationService, private configService: ConfigService, private sanitizer: DomSanitizer, private carService: CarService, private errorService: ErrorService) {

        this.location = new Location();
        this.station = new Station();
        this.connector = new Connector();

        this.locationId = navParams.get("locationId");

        this.isDesktop = platform.is("core");
        this.isIOS = platform.is("ios");
        this.isAndroid = platform.is("android");
        this.isWindows = platform.is("windows");

        this.showMapDefaultControlls = !this.isDesktop;

        this.slideOptions = {
            initialSlide: 1,
            loop: true
        };

        this.weekdays = [
            'Mo.',
            'Di.',
            'Mi.',
            'Do.',
            'Fr.',
            'Sa.',
            'So.'
        ];

        this.plugTypes = [];

        this.plugSvg = '';

        this.loadOpeningHours();

        this.today = new Date().getDay() - 1;
        if (this.today == -1) {
            this.today = 6;
        }

        this.averageRating = -1;

        this.maxPrice = 0;
        this.minPrice = 0;
    }

    ionViewWillEnter() {
        this.charging = this.chargingService.isCharging();
        this.getLocationDetail();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    detailedMap() {
        let modal = this.modalCtrl.create(MapDetailPage, {
            "location": this.location
        });
        modal.present();
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
                this.station = this.location.stations[0];
                this.connector = this.station.connectors[0];

                this.flatrateTariff = this.connector.priceprovider.public.selected === 'flatrate';

                this.loadOpeningHours();

                this.loadMap();
                this.getRatings();

                this.getPrice();

                this.configService.getPlugTypes().subscribe((plugTypes) => {
                        this.plugTypes = plugTypes;
                        this.plugSvg = this.getSvgForPlug(+this.connector.plugtype);
                    },
                    error => this.errorService.displayErrorWithKey(error, 'Liste - Steckertypen'));
            },
            error => {
                this.errorService.displayErrorWithKey(error, 'Standortdetails');
                this.dismiss();
            }
        );
        return observable;
    }

    getPrice() {
        let priceObject: any = {};

        let currentUser = this.authService.getUser();
        let activeCar = this.carService.getActiveCar();

        if (currentUser !== null && activeCar !== null) {
            priceObject.maxCharging = activeCar.maxCharging;
        }

        this.locationService.getPrice(this.connector.id, priceObject).subscribe((response) => {
                this.maxPrice = response.max;
                this.minPrice = response.min;
                this.includingVat = response.vat;
            },
            error => this.errorService.displayErrorWithKey(error, 'Preisabfrage'));
    }

    getRatings() {
        let observable = this.ratingService.getRatings(this.location.id);
        observable.subscribe(
            ratings => {
                this.ratings = ratings;
                this.averageRating = this.getAverageRating();
            },
            error => this.errorService.displayErrorWithKey(error, 'Liste - Bewertungen')
        );
    }

    loadOpeningHours() {
        this.openingHours = [];

        this.weekdays.forEach((name, index) => {
            let weekday = {
                'name': name,
                'fromTo': this.getOpeningHoursForDay(index)
            };

            this.openingHours.push(weekday);
        })
    }

    getOpeningHoursForDay(day: number) {
        let hours = this.connector.weekcalendar.hours;

        if (hours[day].from == hours[day].to) {
            return "geschlossen";
        }

        return hours[day].from + ':00 - ' + hours[day].to + ':00 Uhr';
    }

    getSvgForPlug(plugId: number) {
        let plugSvg = '';

        this.plugTypes.forEach((plug) => {
            if (plug.id == plugId) {
                plugSvg = plug.svg;
            }
        });

        return this.sanitizer.bypassSecurityTrustHtml(plugSvg);
    }

    getAverageRating() {
        let ratingSum = 0;

        this.ratings.forEach((rating) => {
            ratingSum += rating.rating;
        });

        let averageRating = -1;
        if (this.ratings.length) {
            // rounds to the nearest 0.5
            averageRating = Math.round((ratingSum / this.ratings.length) * 2) / 2;
        }

        return averageRating;
    }

    loadMap() {
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

        let image = this.location.isRented() || this.location.isClosed() ? 'busy.png' : 'available.png';
        let icon = `assets/icons/marker/${image}`;

        new google.maps.Marker({
            position: new google.maps.LatLng(this.location.lat, this.location.lng),
            map: this.map,
            icon: icon
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
                    error => {
                        if ('cancelled' !== error) {
                            alert('App konnte nicht gestartet werden: ' + error);
                        }
                    }
                );
        }
    }

    loginModal() {
        let modal = this.modalCtrl.create(SignupLoginPage, {'trackReferrer': 'Location Laden Buttons'});
        modal.present();
    }

    charge() {
        if (this.authService.loggedIn()) {
            let location = this.charging ? this.chargingService.getLocation() : this.location;

            let chargingModal = this.modalCtrl.create(ChargingPage, {
                "location": location,
                "isCharging": this.charging
            });

            chargingModal.onDidDismiss((d) => {
                if (d.isCharging == true && !d.fromLocationDetailsAndIsCharging) {
                    this.viewCtrl.dismiss();
                }
                if (d.didStop == true) {
                    d.location = this.location;

                    let chargingCompletedModal = this.modalCtrl.create(ChargingCompletePage, d);
                    chargingCompletedModal.present();
                }
            });
            chargingModal.present();

        }
        else {
            this.loginModal();
        }

    }

    showHelp(type) {
        let message = "";

        if ("price-range" === type) {
            message = "Sollte Dir hier kein exakter Preis, sondern eine Preisspanne angezeigt werden, " +
                "dann liegt es daran, dass Du Deinem Profil noch kein Elektroauto hinzugefügt hast. " +
                "Da die Batteriekapazität als Berechnungsgrundlage gilt, werden hier die Preise " +
                "für verschiedene Batteriekapazitäten angezeigt.";
        }

        let alert = this.alertCtrl.create({
            title: 'Info',
            message: message,
            buttons: ['Ok']
        });
        alert.present();
    }
}
