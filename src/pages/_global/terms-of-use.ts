import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';

@Component({
    selector: 'page-terms-of-use',
    templateUrl: 'terms-of-use.html'
})
export class TermsOfUsePage {

    constructor(private viewCtrl: ViewController) {
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
