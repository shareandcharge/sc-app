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

        this.weekdays = [
            {
                "text": "Monday",
                "key" : "monday"
            },
            {
                "text": "Tuesday",
                "key" : "tuesday"
            },
            {
                "text": "Wednesday",
                "key" : "wednesday"
            },
            {
                "text": "Thursday",
                "key" : "thursday"
            },
            {
                "text": "Friday",
                "key" : "friday"
            },
            {
                "text": "Saturday",
                "key" : "saturday"
            },
            {
                "text": "Sunday",
                "key" : "sunday"
            }
        ];


        this.days = [
            {
                "text": "Monday",
                "enabled": true,
                "key" : "monday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Tuesday",
                "enabled": false,
                "key" : "tuesday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Wednesday",
                "enabled": true,
                "key" : "wednesday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Thursday",
                "enabled": false,
                "key" : "thursday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Friday",
                "enabled": true,
                "key" : "friday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Saturday",
                "enabled": false,
                "key" : "saturday",
                "from": "",
                "to" : ""
            },
            {
                "text": "Sunday",
                "enabled": false,
                "key" : "sunday",
                "from": "",
                "to" : ""
            }
        ]

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

        this.navCtrl.push(AddStationImagePage);
    }

    updateSelectedDays(e) {

        let me = this;
        this.days.forEach(d => {
            d.enabled = false;
            d.from = "";
            d.to = "";
        });

        e.forEach(wd => {
            this.days.forEach(d => {
                if(wd == d.text){
                    d.enabled = true;
                    d.from = me.from;
                    d.to = me.to;
                }
            });
        });
    }

    updateCustomSelectedDays(e){
        this.weekdays = [];

        this.days.forEach(d => {
            if(d.enabled){
                /*let data = {
                    "text" : d.text,
                };*/
                this.weekdays.push(d.text);
            }
        });
    }
}
