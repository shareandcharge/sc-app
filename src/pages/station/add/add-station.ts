import {Component, ViewChild, ElementRef} from '@angular/core';
import {
    NavController,
    LoadingController,
    NavParams,
    ModalController, Events, AlertController
} from 'ionic-angular';
import {AddStationImagePage} from "../add-image/add-image";
import {Platform} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {AuthService} from "../../../services/auth.service";
import {StationMapDetailPage} from "./station-add-map/map";
import {Location} from "../../../models/location";
import {Station} from "../../../models/station";
import {Connector} from "../../../models/connector";
import {SetTariffPage} from "../set-tariff/set-tariff";
import {EditProfilePage} from "../../profile/profile-data/edit-profile/edit-profile";
import {TrackerService} from "../../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";
import {ConfigService} from "../../../services/config.service";

/**
 * weekCalendar times:
 * 0 - 24 = open 24 hours
 * 0 - 0 = closed
 */
@Component({
    selector: 'page-add-station',
    templateUrl: 'add-station.html',
    providers: []
})
export class AddStationPage {
    @ViewChild('map') mapElement: ElementRef;

    segmentTabs: any;
    autocompleteItems: any;
    service: any;
    dayHours: any;
    days: any;
    address: any;
    weekdays: any;
    from: any;
    to: any;
    flowMode: any;
    timeSelectOptions: any;

    locObject: Location;
    station: Station;
    connector: Connector;

    defaultCenterLat = 52.5167693;
    defaultCenterLng = 13.3773908;

    countrySetFromMarker: null;
    allowedCountries: any;

    map: any;
    marker: any;
    placesService: any;
    private platform;
    mapDefaultControlls: boolean;

    geolocationInProgress: boolean;

    customWeekCalendar: any;

    defaultZoom = 16;

    errorMessages: any;
    daySelectOptions: any;

    constructor(public navCtrl: NavController, private modalCtrl: ModalController, public auth: AuthService,
                private loadingCtrl: LoadingController, platform: Platform, navParams: NavParams,
                private events: Events, private alertCtrl: AlertController, private trackerService: TrackerService,
                private translateService: TranslateService, private configService: ConfigService) {

        if (typeof navParams.get("mode") != 'undefined') {
            this.flowMode = navParams.get("mode");
        }
        else {
            this.flowMode = "add";
        }

        this.allowedCountries = configService.get('ALLOWED_COUNTRIES');

        this.from = 0;
        this.to = 24;

        this.timeSelectOptions = {
            fromTitle: this.translateService.instant('common.from'),
            toTitle: this.translateService.instant('common.to')
        }

        this.daySelectOptions = {
            title: this.translateService.instant('location.location_details.select_days'),
            cssClass: 'alert-checkbox-narrow'
        };

        this.service = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];

        this.segmentTabs = 'default';

        this.dayHours = [
            {
                "value": 0,
                "title": "00:00"
            },
            {
                "value": 1,
                "title": "01:00"
            },
            {
                "value": 2,
                "title": "02:00"
            },
            {
                "value": 3,
                "title": "03:00"
            },
            {
                "value": 4,
                "title": "04:00"
            },
            {
                "value": 5,
                "title": "05:00"
            },
            {
                "value": 6,
                "title": "06:00"
            },
            {
                "value": 7,
                "title": "07:00"
            },
            {
                "value": 8,
                "title": "08:00"
            },
            {
                "value": 9,
                "title": "09:00"
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
            },
            {
                "value": 20,
                "title": "20:00"
            },
            {
                "value": 21,
                "title": "21:00"
            },
            {
                "value": 22,
                "title": "22:00"
            },
            {
                "value": 23,
                "title": "23:00"
            },
            {
                "value": 24,
                "title": "24:00"
            }
        ];

        this.weekdays = [0, 1, 2, 3, 4, 5, 6];

        this.days = [
            this.translateService.instant('common.monday'),
            this.translateService.instant('common.tuesday'),
            this.translateService.instant('common.wednesday'),
            this.translateService.instant('common.thursday'),
            this.translateService.instant('common.friday'),
            this.translateService.instant('common.saturday'),
            this.translateService.instant('common.sunday')
        ];


        this.platform = platform;
        this.mapDefaultControlls = !this.platform.is("core");

        if (typeof navParams.get("location") != 'undefined') {
            this.locObject = navParams.get("location");
            this.station = this.locObject.stations[0];
            this.connector = this.station.connectors[0];
            this.events.publish('priceprovider:save', this.connector.priceprovider);
            this.cloneWeekcalendar();
            this.initializeWeekcalendar();

        } else {
            // create new location, station and connector
            this.locObject = new Location();

            this.station = new Station();
            this.locObject.stations.push(this.station);

            this.connector = new Connector;
            this.station.connectors.push(this.connector);

            this.setDefaultWeekcalendar();

            this.updateSelectedDays();
        }

        this.events.publish('flowMode:save', this.flowMode);

        this.clearErrorMessages();
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.loadMap();
        });
    }

    ionViewDidEnter() {
        this.checkProfileComplete();

        let eventName = 'Started ' + (this.isAdd() ? 'Add' : 'Edit') + ' Charging Station';
        let screenName = (this.isAdd() ? this.translateService.instant('create_location') : this.translateService.instant('update_location'));
        this.trackerService.track(eventName, {
            "Screen Name": screenName
        });
    }

    setDefaultWeekcalendar() {
        this.customWeekCalendar = {
            hours: [
                {
                    from: 0,
                    to: 24
                },
                {
                    from: 0,
                    to: 24
                },
                {
                    from: 0,
                    to: 24
                },
                {
                    from: 0,
                    to: 24
                },
                {
                    from: 0,
                    to: 24
                },
                {
                    from: 0,
                    to: 24
                },
                {
                    from: 0,
                    to: 24
                }
            ]
        }
    }

    initializeWeekcalendar() {
        let from;
        let to;
        let weekdays = [];

        this.connector.weekcalendar.hours.forEach((day, index) => {
            if (day.from != day.to) {
                if (typeof from === 'undefined') {
                    from = day.from;
                }

                if (typeof to === 'undefined') {
                    to = day.to;
                }

                if (day.from != from || day.to != to) {
                    this.segmentTabs = 'custom';
                }

                weekdays.push(index);
            }
        });

        if (weekdays.length) {
            this.from = from;
            this.to = to;
            this.weekdays = weekdays;

            this.updateSelectedDays();
        }
    }

    detailedMap() {
        // don't open detail map if we don't have a marker, yet
        if (!this.marker) return;

        let modal = this.modalCtrl.create(StationMapDetailPage, {
            "position": this.marker.getPosition()
        });

        modal.onDidDismiss((position) => this.positionMarker(position.lat(), position.lng()));

        modal.present();
    }

    updateSearch() {
        if (this.locObject.address == '') {
            this.autocompleteItems = [];
            return;
        }
        let me = this;
        this.service.getPlacePredictions({
            input: this.locObject.address
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
        this.autocompleteItems = [];

        this.centerToPlace(item);

        this.locObject.address = item.description;
    }

    centerToPlace(place) {
        let request = {
            placeId: place.place_id
        };

        this.placesService = new google.maps.places.PlacesService(this.map);
        this.placesService.getDetails(request, (place, status) => {

            if (status == google.maps.places.PlacesServiceStatus.OK) {
                this.positionMarker(place.geometry.location.lat(), place.geometry.location.lng());
            }
            else {
                //console.error('Place err: ', status);
            }
        });
    }


    positionMarker(lat, lng, panTo = true) {
        let latLng = new google.maps.LatLng(lat, lng);

        let image = 'available.png';
        let icon = `assets/icons/marker/${image}`;

        if (null == this.marker) {
            this.marker = new google.maps.Marker({
                draggable: true,
                position: latLng,
                map: this.map,
                icon: icon
            });
        }
        else {
            this.marker.setPosition(latLng);
        }

        if (panTo) {
            this.map.panTo(latLng);
        }

        google.maps.event.addListener(this.marker, 'dragend', () => {
            this.setAddressFromMarker();
            setTimeout(() => this.map.panTo(this.marker.getPosition()), 200);
        });

        this.setAddressFromMarker();
    }

    /**
     * reverse geocode address for marker and set in location if field in location is empty
     */
    setAddressFromMarker() {
        let geocoder = new google.maps.Geocoder;
        this.countrySetFromMarker = null;

        geocoder.geocode({'location': this.marker.getPosition()}, (results, status) => {
            if (status !== google.maps.GeocoderStatus.OK || !results[0]) return;

            if (this.locObject.address) {
                this.locObject.lat = results[0].geometry.location.lat();
                this.locObject.lng = results[0].geometry.location.lng();
            } else {
                this.locObject.address = results[0].formatted_address;
            }

            this.countrySetFromMarker = this.extractCountryFromGeocoderResult(results);
            this.validateCountry();
        });
    }

    setAddressFromProfile() {
      let userProfile = this.auth.getUser().profile;
      let addr = userProfile.address + ', ' + userProfile.city

      let me = this;
        this.service.getPlacePredictions({
          input: addr,
        }, function (predictions, status) {
          me.autocompleteItems = [];
          if (predictions != null) {
            if (predictions.length ===  1) {
              me.chooseItem(predictions[0])
            } else {
              me.autocompleteItems = [];
              predictions.forEach(function (prediction) {
                me.autocompleteItems.push(prediction);
              });
            }
          }
        })
    }

    extractCountryFromGeocoderResult(result) {
        /**
         * Result-type must contain "country". Then the address_components short_name always is
         * in an international/english format (DE, US, NL ...)
         */
        let country = null;
        result.forEach((res) => {
            if (res.types.includes('country')) {
                country = res.address_components[0].short_name;
                return;
            }
            
            res.address_components.forEach((component) => {
                if (component.types.includes('country')) {
                    country = component.short_name;
                    return;
                }
            })   
        });

        return country;
    }

    loadMap() {
        let loader = this.loadingCtrl.create({
            content: this.translateService.instant('station.load_map'),
        });
        loader.present();

        let mapOptions = {
            center: new google.maps.LatLng(this.defaultCenterLat, this.defaultCenterLng),
            zoom: this.defaultZoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            fullscreenControl: false,
            disableDefaultUI: this.mapDefaultControlls
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        if (this.flowMode == 'add') {
            let options = {
                maximumAge: 0, timeout: 10000, enableHighAccuracy: true
            };

            this.geolocationInProgress = true;
            Geolocation.getCurrentPosition(options).then(
                (position) => {
                  this.geolocationInProgress = false;
                  this.positionMarker(position.coords.latitude, position.coords.longitude);
                },
                () => {
                  this.geolocationInProgress = false;
                  this.positionMarker(this.defaultCenterLat, this.defaultCenterLng);
                });
        }
        else {
            this.positionMarker(this.locObject.lat, this.locObject.lng);
        }

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            loader.dismissAll();
        });
    }

    skipAddingStation() {
        this.navCtrl.parent.pop();
    }

    prepareProcedure() {
        if (this.segmentTabs == 'custom') {
            this.connector.weekcalendar = this.customWeekCalendar;
        }
    }

    saveChanges() {
        this.prepareProcedure();

        if (this.validateForm()) {
            this.trackerService.track('Save Info - ' + (this.isAdd() ? 'Add' : 'Edit'), {
                'Screen Name': 'Ladestation bearbeiten'
            });

            if (this.connector.atLeastOneTarifSelected()) {
                this.events.publish('locations:update', this.locObject);
            } else {
                this.navCtrl.push(SetTariffPage, {
                    "location": this.locObject,
                    "mode": this.flowMode,
                    "setTariffAlert": true
                });
            }
        }
    }

    continueAddStation() {
        this.prepareProcedure();

        if (this.validateForm()) {
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

            this.trackerService.track('Proceed Info - ' + (this.isAdd() ? 'Add' : 'Edit'), {
                'Screen Name': this.isAdd() ? this.translateService.instant('create_location') : this.translateService.instant('update_location')
            });

            this.navCtrl.push(AddStationImagePage, {
                "location": this.locObject,
                "mode": this.flowMode
            });
        }
    }

    clearErrorMessages() {
        this.errorMessages = {
            "address": '',
            "openingHours": ''
        }
    }

    validateForm() {
        let hasError = false;
        this.clearErrorMessages();

        if (!this.validateCountry()) {
            hasError = true;
        }
        if (!this.locObject.address) {
            hasError = true;
            this.errorMessages.address = this.translateService.instant('error_messages.address_2');
        }
        if (!this.isOpeningHoursSelected()) {
            hasError = true;
            this.errorMessages.openingHours = this.translateService.instant('error_messages.opening_hours');
        }

        return !hasError;
    }

    validateCountry(): boolean {
        this.errorMessages.country = '';

        if (!this.isCountryAllowed()) {
            this.errorMessages.country = this.translateService.instant('error_messages.invalid_country');
            return false;
        }

        return true;
    }


    isCountryAllowed() {
        if (null === this.countrySetFromMarker) return false;

        return this.allowedCountries.includes(this.countrySetFromMarker);
    }

    isOpeningHoursSelected() {
        return this.connector.weekcalendar.hours.some((day) => {
            return (day.from > 0 || day.to > 0) && day.from < day.to;
        });
    }

    updateSelectedDays() {
        for (let day of this.connector.weekcalendar.hours) {
            day.from = 0;
            day.to = 0;
        }

        for (let weekday of this.weekdays) {
            this.connector.weekcalendar.hours[weekday].from = this.from;
            this.connector.weekcalendar.hours[weekday].to = this.to;
        }
    }

    setDayClosed(day) {
        day.from = 0;
        day.to = 0;
    }

    cloneWeekcalendar() {
        this.customWeekCalendar = JSON.parse(JSON.stringify(this.connector.weekcalendar));
    }

    checkProfileComplete() {
        if (this.auth.getUser().isProfileComplete()) return true;

        let alert = this.alertCtrl.create({
            title: this.translateService.instant('station.data_incomplete'),
            message: this.translateService.instant('station.msg_complete_profile'),
            buttons: [
                {
                    text: this.translateService.instant('station.edit_profile'),
                    handler: () => {
                        this.navCtrl.push(EditProfilePage, {
                            'user': this.auth.getUser()
                        });
                    }
                },
                {
                    text: this.translateService.instant('common.cancel'),
                    handler: () => {
                        this.skipAddingStation();
                    },
                    role: 'cancel'
                }
            ]
        });

        alert.present();

        return false;
    }

    isAdd() {
        return this.flowMode == 'add';
    }
}
