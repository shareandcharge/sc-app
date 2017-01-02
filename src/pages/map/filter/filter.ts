import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';

@Component({
    templateUrl: 'filter.html'
})
export class MapFilterPage {
    constructor(public viewCtrl: ViewController) {
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}