import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ModalController, LoadingController, PopoverController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {Platform} from 'ionic-angular';
import {AutocompletePage} from './autocomplete';
import {MapSettingsPage} from '../map-settings/map-settings';
import {MapFilterPage} from './filter/filter';
import {LocationDetailPage} from "../location/location-details";


declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {

    /*constructor(public navCtrl: NavController) {

     }*/

    address;

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    placesService: any;
    private platform;

    defaultCenterLat = 51.6054624;
    defaultCenterLng = 10.6679155;
    defaultZoom = 7;
    currentPositionZoom = 13;

    constructor(public popoverCtrl: PopoverController, platform: Platform, public navCtrl: NavController, private modalCtrl: ModalController, private loadingCtrl: LoadingController) {
        this.platform = platform;

        this.address = {
            place: ''
        };

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log('Platform ready');
        });
    }

    ionViewDidLoad() {
        console.log("view loaded.");
        this.loadMap();
    }

    /*ionViewLoaded(){
     this.loadMap();
     }*/

    centerCurrentPosition() {
        Geolocation.getCurrentPosition().then((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.map.setZoom(this.currentPositionZoom);
            this.map.setCenter(latLng);
        }, (err) => {
            console.log(err);
        });
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
            fullscreenControl: false
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMapCenterControl();
        this.addMapFilterControl();

        console.log("map elem:", this.mapElement.nativeElement);

        let me = this;

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            me.addDummyMarkers();
            loader.dismissAll();
        });
    }

    // createMarker() {
    //     this.addMarker(this.map.getCenter());
    // }

    addMarker(location) {
        console.log('ADD MARKER: ', location);
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(location.latitude, location.longitude)
        });

        let me = this;
        marker.addListener('click', function () {
            console.log('OPEN:', location);
            me.navCtrl.push(LocationDetailPage, {
                "location": location
            });
        });

        // let content = location.name;
        // this.addInfoWindow(marker, content);
    }


    mapSettingsPopOver(e) {
        let popover = this.popoverCtrl.create(MapSettingsPage, {
            map: this.map
        });

        popover.present({
            ev: e
        });
    }


    addInfoWindow(marker, content) {

        let infoWindow = new google.maps.InfoWindow({
            content: content,
            enableEventPropagation: true
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }

    presentFilterModal() {
        let filter = this.modalCtrl.create(MapFilterPage);
        filter.present();
    }

    showAddressModal() {
        let modal = this.modalCtrl.create(AutocompletePage);
        modal.onDidDismiss(place => {
            if (place) {
                console.log('DATA:', place);
                this.address.place = place;
                this.centerToPlace(place);
            }
        });
        modal.present();
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
                me.map.setZoom(me.currentPositionZoom);
            }
            else {
                console.log('Place err: ', status);
            }
        }
    }

    addMapCenterControl() {
        var centerControlDiv = document.createElement('div');

        var controlUI = document.createElement('div');
        controlUI.id = 'mapCenterUI';
        centerControlDiv.appendChild(controlUI);


        var controlText = document.createElement('div');
        controlText.id = 'mapCenterText';
        controlText.innerHTML = '<ion-icon name="md-locate" role="img" class="icon icon-md ion-md-locate" aria-label="locate" ng-reflect-name="md-locate"></ion-icon>';
        controlUI.appendChild(controlText);

        let me = this;

        controlUI.addEventListener('click', function () {
            me.centerCurrentPosition();
        });

        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv);
    }

    addMapFilterControl() {
        var centerControlDiv = document.createElement('div');

        var controlUI = document.createElement('div');
        controlUI.id = 'mapFilterUI';
        centerControlDiv.appendChild(controlUI);


        var controlText = document.createElement('div');
        controlText.id = 'mapFilterText';
        controlText.innerHTML = '<ion-icon name="filter" role="img" class="icon icon-ios ion-ios-funnel" aria-label="filter" ng-reflect-name="filter"></ion-icon>';
        controlUI.appendChild(controlText);

        let me = this;

        controlUI.addEventListener('click', function () {
            me.presentFilterModal()
        });

        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv);
    }

    addDummyMarkers() {
        let dummys = [

            {
                "id": 1,
                "owner": "cb7f00b318513870f477c6d78bf478023e5e481f",
                "name": "Intuitive asynchronous challenge",
                "description": "non velit donec diam neque vestibulum eget vulputate ut ultrices",
                "images": [
                    "http://dummyimage.com/400x300.jpg/99dddd/000000",
                    "http://dummyimage.com/400x300.jpg/5fa2dd/ffffff"
                ],
                "latitude": "51.1646",
                "longitude": "6.7519",
                "address": "9716 Westerfield Center",
                "_country": "Germany",
                "city": "Neuss",
                "stations": [
                    {
                        "name": "tortor",
                        "connectors": [
                            {
                                "status": 4,
                                "plugType": 1
                            }
                        ]
                    }
                ]
            },
            {
                "id": 2,
                "owner": "5d70e8dbffab79e90bc9c078df2fc8e4037993cd",
                "name": "Reduced fault-tolerant array",
                "description": "viverra dapibus nulla suscipit ligula in lacus curabitur at ipsum ac tellus semper interdum mauris ullamcorper",
                "images": [
                    "http://dummyimage.com/400x300.jpg/dd00dd/000000",
                    "http://dummyimage.com/400x300.jpg/5fa2dd/ffffff"
                ],
                "latitude": "51.216",
                "longitude": "7.1418",
                "address": "6388 Artisan Way",
                "_country": "Germany",
                "city": "Wuppertal",
                "stations": [
                    {
                        "name": "vitae quam",
                        "connectors": [
                            {
                                "status": 1,
                                "plugType": 4
                            },
                            {
                                "status": 1,
                                "plugType": 3
                            }
                        ]
                    }
                ]
            },
            {
                "id": 3,
                "owner": "1e5c136d9f1c79d603148b8b5e18f9ed31fcb16b",
                "name": "Compatible intermediate internet solution",
                "description": "mollis molestie lorem quisque ut erat curabitur gravida nisi at nibh in hac",
                "images": [
                    "http://dummyimage.com/400x300.jpg/5fF444/ffffff",
                    "http://dummyimage.com/400x300.jpg/dddddd/000000"
                ],
                "latitude": "51.129",
                "longitude": "6.4386",
                "address": "1 Eggendart Place",
                "_country": "Germany",
                "city": "Mönchengladbach",
                "stations": [
                    {
                        "name": "non lectus",
                        "connectors": [
                            {
                                "status": 4,
                                "plugType": 4
                            },
                            {
                                "status": 2,
                                "plugType": 1
                            }
                        ]
                    }
                ]
            },
            {
                "id": 4,
                "owner": "6a0d357446bfc2f01e906ae18a80ce7bd39dc45f",
                "name": "Digitized interactive conglomeration",
                "description": "gravida nisi at nibh in hac habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem integer",
                "images": [
                    "http://dummyimage.com/400x300.jpg/ff4466/ffffff",
                    "http://dummyimage.com/400x300.jpg/ff4444/ffffff"
                ],
                "latitude": "54.3205",
                "longitude": "10.051",
                "address": "352 Sundown Place",
                "_country": "Germany",
                "city": "Kiel",
                "stations": [
                    {
                        "name": "quis orci",
                        "connectors": [
                            {
                                "status": 2,
                                "plugType": 4
                            },
                            {
                                "status": 2,
                                "plugType": 3
                            }
                        ]
                    }
                ]
            },
            {
                "id": 5,
                "owner": "7474358db0ed23e2517c723fe6db7d951e6af8f6",
                "name": "Configurable discrete core",
                "description": "nulla ac enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem",
                "images": [
                    "http://dummyimage.com/400x300.jpg/5fa200/ffffff",
                    "http://dummyimage.com/400x300.jpg/ff4444/ffffff"
                ],
                "latitude": "49.4811",
                "longitude": "8.4353",
                "address": "733 Warner Alley",
                "_country": "Germany",
                "city": "Ludwigshafen am Rhein",
                "stations": [
                    {
                        "name": "eu",
                        "connectors": [
                            {
                                "status": 2,
                                "plugType": 3
                            }
                        ]
                    }
                ]
            },
            {
                "id": 6,
                "owner": "14a4b90d0e4fab2cd42482e47d326bf2a5f284a3",
                "name": "Assimilated tangible info-mediaries",
                "description": "tortor quis turpis sed ante vivamus tortor duis mattis egestas metus aenean fermentum donec ut mauris",
                "images": [
                    "http://dummyimage.com/400x300.jpg/cc2200/ffffff",
                    "http://dummyimage.com/400x300.jpg/cc0000/ffffff"
                ],
                "latitude": "50.9968",
                "longitude": "11.0079",
                "address": "57426 Moulton Parkway",
                "_country": "Germany",
                "city": "Erfurt",
                "stations": [
                    {
                        "name": "amet erat",
                        "connectors": [
                            {
                                "status": 4,
                                "plugType": 3
                            },
                            {
                                "status": 2,
                                "plugType": 1
                            }
                        ]
                    }
                ]
            },
            {
                "id": 7,
                "owner": "0bb49b0ccd8abcf2c46f0360fbeb669b3fe57e48",
                "name": "Business-focused multi-state encoding",
                "description": null,
                "images": [
                    "http://dummyimage.com/400x300.jpg/5fa2dd/ffffff",
                    "http://dummyimage.com/400x300.jpg/5fa2dd/ffffff"
                ],
                "latitude": "51.1833",
                "longitude": "7.2556",
                "address": "23039 Mendota Junction",
                "_country": "Germany",
                "city": "Remscheid",
                "stations": [
                    {
                        "name": "ante",
                        "connectors": [
                            {
                                "status": 4,
                                "plugType": 1
                            }
                        ]
                    }
                ]
            },
            {
                "id": 8,
                "owner": "88adceec4dba050a7e0a9d9aeee932beaa65811b",
                "name": "Re-contextualized mobile capacity",
                "description": "odio in hac habitasse platea dictumst maecenas ut",
                "images": [
                    "http://dummyimage.com/400x300.jpg/ff4444/ffffff",
                    "http://dummyimage.com/400x300.jpg/5fa2dd/ffffff"
                ],
                "latitude": "48.1738",
                "longitude": "11.5858",
                "address": "62032 Lakewood Gardens Terrace",
                "_country": "Germany",
                "city": "München",
                "stations": [
                    {
                        "name": "vivamus tortor",
                        "connectors": [
                            {
                                "status": 2,
                                "plugType": 4
                            }
                        ]
                    }
                ]
            },
            {
                "id": 9,
                "owner": "17b135b5d9f4e6f30a6913b3f3d96b9fd7bdb8b9",
                "name": "Ameliorated intangible implementation",
                "description": "bibendum imperdiet nullam orci pede",
                "images": [
                    "http://dummyimage.com/400x300.jpg/5fa2dd/ffffff",
                    "http://dummyimage.com/400x300.jpg/dddddd/000000"
                ],
                "latitude": "53.5953",
                "longitude": "10.0122",
                "address": "77779 Gina Road",
                "_country": "Germany",
                "city": "Hamburg Winterhude",
                "stations": [
                    {
                        "name": "viverra pede",
                        "connectors": [
                            {
                                "status": 3,
                                "plugType": 2
                            },
                            {
                                "status": 1,
                                "plugType": 1
                            }
                        ]
                    }
                ]
            },
            {
                "id": 10,
                "owner": "ef89e56b752564a070a3e806c162fc10da828774",
                "name": "Secured grid-enabled encoding",
                "description": "sapien quis libero nullam sit amet turpis elementum ligula vehicula consequat morbi a ipsum",
                "images": [
                    "http://dummyimage.com/400x300.jpg/5fa2dd/ffffff",
                    "http://dummyimage.com/400x300.jpg/5fa2dd/ffffff"
                ],
                "latitude": "50.7659",
                "longitude": "12.946",
                "address": "1357 Susan Point",
                "_country": "Germany",
                "city": "Chemnitz",
                "stations": [
                    {
                        "name": "morbi non",
                        "connectors": [
                            {
                                "status": 3,
                                "plugType": 3
                            },
                            {
                                "status": 3,
                                "plugType": 1
                            }
                        ]
                    }
                ]
            },
            {
                "id": "11",
                "name": "name 11",
                "title": "My yash"
            }

        ];
        let me = this;
        dummys.forEach(function (location) {
            me.addMarker(location);
        });
    }
}
