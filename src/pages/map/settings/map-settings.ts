import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';
import {ConfigService} from "../../../services/config.service";

declare var google;

@Component({
    selector: 'page-map-settings',
    templateUrl: 'map-settings.html'
})
export class MapSettingsPage {
    mapViewType: 'roadMap';
    map: any;

    setViewType: any;
    getViewType: any;

    appVersion: string;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, private navParams: NavParams,
                private configService: ConfigService) {
        this.map = navParams.get("map");
        this.setViewType = navParams.get('setViewType');
        this.getViewType = navParams.get('getViewType');
        this.appVersion = configService.get('APP_VERSION');
    }

    setMapView(selected) {
        switch (selected) {
            case 'ROADMAP':
                this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                break;
            case 'SATELLITE':
                this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                break;
            case 'HYBRID':
                this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                break;
        }
    }

    refreshMarkers() {
        this.viewCtrl.dismiss({action: 'refresh'});
    }

    setView = (view) => {
        this.setViewType(view);
        this.viewCtrl.dismiss();
    }
}
