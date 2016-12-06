import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {AddStationImagePage} from "../add-image/add-image";

@Component({
    selector: 'page-add-station',
    templateUrl: 'add-station.html'
})
export class AddStationPage {
    segmentTabs: any;
    dayHours:any;
    days:any;

    constructor(public navCtrl:NavController, private viewCtrl:ViewController) {

        this.segmentTabs = 'default';

        this.dayHours = [
            {
                "value" : "9",
                "title" : "9:00"
            },
            {
                "value" : "10",
                "title" : "10:00"
            },
            {
                "value" : "11",
                "title" : "11:00"
            },

        ];

        this.days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];
    }

    ionViewDidLoad() {
        console.log('Hello AddStationPage Page');
    }

    skipAddingStation() {
        this.viewCtrl.dismiss();
    }

    continueAddStation() {
        this.navCtrl.push(AddStationImagePage);
    }

}
