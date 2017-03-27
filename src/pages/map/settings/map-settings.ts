import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';

declare var google;

@Component({
    selector: 'page-map-settings',
    templateUrl: 'map-settings.html'
})
export class MapSettingsPage {
    mapViewType:'roadMap';
    map:any;

    setViewType:any;
    getViewType:any;

    constructor(public navCtrl:NavController, private viewCtrl:ViewController, private navParams:NavParams) {
        this.map = navParams.get("map");
        this.setViewType = navParams.get('setViewType');
        this.getViewType = navParams.get('getViewType');
    }

    ionViewDidLoad() {
        //console.log('Hello MapSettingsPage Page');
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
