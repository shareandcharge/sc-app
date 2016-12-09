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
    station:any;
    address:any;
    weekdays:any;
    from:any;
    to:any;
    descriptions:any;

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
            {
                "text": "Monday",
                "enabled": true
            },
            {
                "text": "Tuesday",
                "enabled": false
            },
            {
                "text": "Wednesday",
                "enabled": true
            },
            {
                "text": "Thursday",
                "enabled": false
            },
            {
                "text": "Friday",
                "enabled": true
            },
            {
                "text": "Saturday",
                "enabled": false
            },
            {
                "text": "Sunday",
                "enabled": false
            }
        ];
    }


    ionViewDidLoad() {
        console.log('Hello AddStationPage Page');
    }

    skipAddingStation() {
        this.viewCtrl.dismiss();
    }

    continueAddStation() {

        this.station = {
            "address": this.address,
            "openingHours":
                {
                    "days": this.weekdays,
                    "from": this.from,
                    "to": this.to
                },
            "descriptions": this.descriptions
        };

        console.log(this.station);

        console.log(this.days);

        this.navCtrl.push(AddStationImagePage);
    }

}
