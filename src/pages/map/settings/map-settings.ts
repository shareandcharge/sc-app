import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';
import {ConfigService} from "../../../services/config.service";

declare var google;

@Component({
    selector: 'page-map-settings',
    templateUrl: 'map-settings.html'
})
export class MapSettingsPage {
    map: any;

    setViewType: any;
    getViewType: any;

    appVersion: string;
    currentMapType: string;

    MAP_TYPE_ROADMAP = google.maps.MapTypeId.ROADMAP;
    MAP_TYPE_SATELLITE = google.maps.MapTypeId.SATELLITE;
    MAP_TYPE_HYBRID = google.maps.MapTypeId.HYBRID;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, private navParams: NavParams,
                private configService: ConfigService) {
        this.map = navParams.get("map");
        this.setViewType = navParams.get('setViewType');
        this.getViewType = navParams.get('getViewType');
        this.appVersion = configService.get('APP_VERSION');
        this.currentMapType = this.map.getMapTypeId();
    }

    setMapView(type) {
        this.map.setMapTypeId(type);
    }

    refreshMarkers() {
        this.viewCtrl.dismiss({action: 'refresh'});
    }

    setView = (view) => {
        this.setViewType(view);
        this.viewCtrl.dismiss();
    }
}
