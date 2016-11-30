import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

@Component({
    selector: 'page-add-station',
    templateUrl: 'add-station.html'
})
export class AddStationPage {

    constructor(public navCtrl:NavController, private viewCtrl:ViewController) {
    }

    ionViewDidLoad() {
        console.log('Hello AddStationPage Page');
    }

    skipAddingStation() {
        this.viewCtrl.dismiss();
    }

    continueAddStation() {

    }

    customizeStation() {

    }
}
