import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
    selector: 'page-terms',
    templateUrl: 'terms.html'
})
export class TermsPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}