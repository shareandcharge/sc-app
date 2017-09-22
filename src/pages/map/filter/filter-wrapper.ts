/**
 * Used to display the filter pages in one modal.
 *
 * Loading this wrapper as modal will create an own navigation controller. This can be used to push pages inside the modal.
 */

import {Component} from '@angular/core'
import {NavParams} from 'ionic-angular';
import {FilterSelectPage} from "./filter-select";

@Component({
    selector: 'page-filter-wrapper',
    templateUrl: 'filter-wrapper.html',
})
export class FilterWrapperPage {
    rootPage:any;
    rootParams:any;

    constructor(private navParams : NavParams) {
        this.rootPage = FilterSelectPage;
        this.rootParams = navParams;
    }
}