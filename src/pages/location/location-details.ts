import {Component, ViewChild, ElementRef} from '@angular/core';
import {
    NavParams, ViewController, Platform, ModalController, AlertController, Content
} from 'ionic-angular';
import {MapDetailPage} from "./details-map/map";
import {AddRatingPage} from "../rating/add-rating";
import {AuthService} from "../../services/auth.service";
import {RatingService} from "../../services/rating.service";
import {Rating} from "../../models/rating";
import {LocationService} from "../../services/location.service";
import {Location} from "../../models/location";
// import {LaunchNavigator, LaunchNavigatorOptions} from 'ionic-native';
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
import {TrackerService} from "../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";
import {StationWrapperPage} from "../station/station-wrapper";
import {User} from "../../models/user";


@Component({
    selector: 'location-details',
    templateUrl: 'location-details.html',
    providers: []
})
export class LocationDetailPage {
    location: Location;
    locationImages: Array<any>;
    station: Station;
    connector: Connector;
    tariffs: any;
    owner: any;

    slideOptions: any;

    @ViewChild(Content) content: Content;
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    defaultZoom = 16;

    showMapDefaultControlls: boolean;
    ratings: Array<Rating> = [];

    showOpeningHours: boolean = false;
    isBusy: boolean = true;

    isDesktop: boolean;

    private locationId: number;

    charging: boolean;

    weekdays: any;

    plugTypes: any;
    plugSvg: any;

    openingHours: any;
    today: number;

    averageRating: number;

    evses: any;
    maxkWh: any;

    includingVat: boolean;
    flatrateTariff: boolean;

    commercialCategoryIcons: Array<string>;

    connectorsWithDetails = new Array<any>();


    ownerMode: boolean = false;

    constructor(private alertCtrl: AlertController, private modalCtrl: ModalController,
                private chargingService: ChargingService, private navParams: NavParams, platform: Platform,
                private viewCtrl: ViewController, private authService: AuthService, public ratingService: RatingService,
                private locationService: LocationService, private configService: ConfigService,
                private sanitizer: DomSanitizer, private carService: CarService, private errorService: ErrorService,
                private trackerService: TrackerService, private translateService: TranslateService) {

        this.location = new Location();
        this.station = new Station();
        this.connector = new Connector();

        this.locationId = navParams.get("locationId");
        this.ownerMode = navParams.get("ownerMode") || false;

        this.isDesktop = platform.is("core");

        this.showMapDefaultControlls = !this.isDesktop;

        this.slideOptions = {
            initialSlide: 1,
            loop: true
        };

        this.weekdays = [
            this.translateService.instant('location.location_details.monday'),
            this.translateService.instant('location.location_details.tuesday'),
            this.translateService.instant('location.location_details.wednesday'),
            this.translateService.instant('location.location_details.thursday'),
            this.translateService.instant('location.location_details.friday'),
            this.translateService.instant('location.location_details.saturday'),
            this.translateService.instant('location.location_details.sunday')
        ];

        // this.selectedTariff = "TIME";
        
        this.plugTypes = [];

        this.plugSvg = '';

        this.loadOpeningHours();

        this.today = new Date().getDay() - 1;
        if (this.today == -1) {
            this.today = 6;
        }

        this.averageRating = -1;

        // this.maxPrice = 0;
        // this.minPrice = 0;

    }

    ionViewWillEnter() {
        this.chargingService.checkChargingState();
        this.charging = this.chargingService.isCharging();
        this.getLocationDetail().subscribe(
            (location) => {
                this.trackerService.track('Station Searched', {
                    'id': location.id,
                    'Address': location.address,
                    'Timestamp': ''
                });

                this.isBusy = this.locationService.isBusy(location);
            }
        );
    }

    ionViewDidEnter() {
        /**
         * We need this so the content adjusts to the differing footer height.
         * Height changes because of changing buttons/contents in the footer.
         */
        this.content.resize();
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
        let connectorsMap = {
            'DOMESTIC_F': 1,//'Schuko-Steckdose'
            'DOMESTIC_E': 2,
            'IEC_62196_T2' : 3, //IEC 62196 Type 2 "Mennekes" 
            'IEC_62196_T2_COMBO': 4,
            'IEC_62196_T1': 5,
            'TESLA_S': 6,
            'CHADEMO': 7,
            1 : 'DOMESTIC_F',
            2 : 'DOMESTIC_E',
            3 : 'IEC_62196_T2',
            4 : 'IEC_62196_T2_COMBO',
            5 : 'IEC_62196_T1',
            6 : 'TESLA_S',
            7 : 'CHADEMO', 
        }

        observable.subscribe(
            (location) => {
                try {
                    this.location = location;
                    this.owner = location.owner;
                    this.station = this.location.getFirstStation();
                    this.connector = this.station.getFirstConnector();
                    this.flatrateTariff = this.station.hasConnector() ? this.connector.priceprovider.public.selected === 'flatrate' : false;
                    this.locationImages = this.locationService.getImagesWithSrc(location);
                }
                catch (e) {
                    this.errorService.displayError(this.translateService.instant('location.location_details.error_no_station_details'));
                    // this.dismiss();
                    return;
                }

                this.loadOpeningHours();
                this.loadMap();
                this.getRatings();
                this.getPrice();
                this.getCommercialCategoryIcons();
                
                this.configService.getPlugTypes().subscribe((plugTypes) => {
                        this.plugTypes = plugTypes;
                        this.maxkWh = 0;
                        // empty connectors array so we don't have double values
                        this.connectorsWithDetails = [];
                        // get all connector details to be displayed for all evses for given location
                        
                        for (let evse of this.location.evses) {
                            for (let con of evse.connectors) {

                                let power;
                                if(con.power_type === 'AC_3_PHASE') {
                                    power = Math.round((con.amperage * con.voltage) * 3 / 1000) ;
                                }else {
                                    power = Math.round((con.amperage * con.voltage) / 1000); 
                                }

                                // get for all plugTypeIds for given location and their power
                                let conTypeId: number =  connectorsMap[con.standard];
                                // the connector with a maximum power is always first in the list
                                this.connectorsWithDetails
                                    .push({"typeId":conTypeId, "power":power,"svg":this.getSvgForPlug(conTypeId)});
                            
                                if (this.maxkWh < power) {
                                    this.maxkWh = power;
                                } 
                                this.connectorsWithDetails.sort((a, b) => {
                                    return b.power-a.power; //descending
                                })

                            }
                        }
                        // this.plugSvg = this.getSvgForPlug(+this.connector.plugtype);
                    },
                    error => this.errorService.displayErrorWithKey(error, this.translateService.instant('location.location_details.list_plugins')));
                
            },
            (error) => {
                this.errorService.displayErrorWithKey(error, this.translateService.instant('location.location_details.location_details'));
                // this.dismiss();
            }
        );
        return observable;
    }

    getPrice() {
        if (!this.connector) {
            return;
        }

        let priceObject: any = {};

        let currentUser = this.authService.getUser();
        let activeCar = this.carService.getActiveCar();

        if (currentUser !== null && activeCar !== null) {
            priceObject.maxCharging = activeCar.maxCharging;
        }

        this.locationService.getPrice(this.connector.id, priceObject).subscribe((response) => {
                this.tariffs = response.priceComponents.map(obj => {
                    let tariff =  obj.priceComponents.type.toLowerCase();
                    return tariff.charAt(0).toUpperCase() + tariff.slice(1);
                });                
            },
            error => this.errorService.displayErrorWithKey(error, this.translateService.instant('location.location_details.query_price')));
    }


    getRatings() {
        let observable = this.ratingService.getRatings(this.location.id);
        observable.subscribe(
            ratings => {
                this.ratings = ratings;
                this.averageRating = this.getAverageRating();
            },
            error => this.errorService.displayErrorWithKey(error, this.translateService.instant('location.location_details.list_eval'))
        );
    }

    getCommercialCategoryIcons() {
        this.commercialCategoryIcons = [];

        let isCommercial = typeof this.location.ownerprofile.operatorVatID !== 'undefined' && this.location.ownerprofile.operatorVatID != '';

        if (!isCommercial) {
            this.commercialCategoryIcons = ['cust-private-station'];
        }
        else if (Array.isArray(this.location.commercialcategory.category)) {
            if (this.location.commercialcategory.category.indexOf(User.COMMERCIAL_CATEGORY_RESTAURANT) > -1) {
                this.commercialCategoryIcons.push('cust-restaurant');
            }
            if (this.location.commercialcategory.category.indexOf(User.COMMERCIAL_CATEGORY_HOTEL) > -1) {
                this.commercialCategoryIcons.push('cust-hotel');
            }
        }
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
        if (!this.connector) {
            return this.translateService.instant('location.location_details.closed');
        }

        let hours = this.connector.weekcalendar.hours;

        if (hours[day].from == hours[day].to) {
            return this.translateService.instant('location.location_details.closed');
        }

        return hours[day].from + ':00 - ' + hours[day].to + ':00 ' + this.translateService.instant('location.location_details.oclock');
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

        let image = this.locationService.isBusy(this.location) ? 'busy.png' : 'available.png';
        let icon = `assets/icons/marker/${image}`;

        new google.maps.Marker({
            position: new google.maps.LatLng(this.location.lat, this.location.lng),
            map: this.map,
            icon: icon
        });
    }

    openMapsApp() {
            let coords = this.location.lat + "," + this.location.lng;
            window.open("http://maps.google.com/?q=" + coords, '_system');
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

            chargingModal.onDidDismiss((data) => {
                if (data && data.isCharging == true && !data.fromLocationDetailsAndIsCharging) {
                    this.viewCtrl.dismiss();
                }
                if (data && data.didStop == true) {
                    let chargingCompletedModal = this.modalCtrl.create(ChargingCompletePage);
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
            message = this.translateService.instant('location.location_details.message');
        }

        let alert = this.alertCtrl.create({
            title: this.translateService.instant('common.info'),
            message: message,
            buttons: [this.translateService.instant('common.ok')]
        });
        alert.present();
    }

    editStation() {
      this.locationService.getLocation(this.location.id).subscribe((location) => {
          let modal = this.modalCtrl.create(StationWrapperPage, {
            "location": location,
            "mode": 'edit'
          });
          modal.present();
        },
        error => this.errorService.displayErrorWithKey(error, 'error.scope.get_location'));
    }
}
