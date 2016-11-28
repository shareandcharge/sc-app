import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';


@Component({
    selector: 'page-map-settings',
    templateUrl: 'map-settings.html'
})
export class MapSettingsPage {
    mapViewType:'roadMap';
    map:any;

    constructor(public navCtrl:NavController, private viewCtrl:ViewController, private navParams:NavParams) {
        this.map = navParams.get("map");
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
}
