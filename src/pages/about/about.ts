import {Component} from '@angular/core';
import {IntroPage} from '../intro/intro';
import {NavController} from 'ionic-angular';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
    providers: []

})
export class AboutPage {
    constructor(private navCtrl: NavController) {
    }

    intro() {
        this.navCtrl.push(IntroPage);
    }
}
