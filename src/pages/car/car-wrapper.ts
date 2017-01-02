/**
 * Used to display the add-car flow in one modal.
 *
 * Loading this wrapper as modal will create an own navigation controller. This can be used to push pages inside the modal.
 */

import {Component} from '@angular/core'
import {NavParams} from 'ionic-angular';
import {CarFormPage} from "./form/car-form";

@Component({
    selector: 'page-car-wrapper',
    templateUrl: 'car-wrapper.html',
})
export class CarWrapperPage {
    rootPage:any;
    rootParams:any;

    constructor(private params : NavParams) {
        this.rootPage = CarFormPage;
        this.rootParams = params;
    }
}