import {Component} from '@angular/core'
import {NavParams} from 'ionic-angular';
import {AddCarPage} from "./add/add-car";

@Component({
    selector: 'page-car-wrapper',
    templateUrl: 'car-wrapper.html',
})
export class CarWrapperPage {
    rootPage:any;
    rootParams:any;

    constructor(private params : NavParams) {
        this.rootPage = AddCarPage;
        this.rootParams = params;
    }
}