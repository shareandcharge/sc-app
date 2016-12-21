/**
 * Used to display the add-car flow in one modal.
 *
 * Loading this wrapper as modal will create an own navigation controller. This can be used to push pages inside the modal.
 */
import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {AddStationPage} from "./add/add-station";

@Component({
    selector: 'page-station-wrapper',
    templateUrl: 'station-wrapper.html',
})
export class StationWrapperPage {
    rootPage:any;
    rootParams:any;

    constructor(private params : NavParams) {
        this.rootPage = AddStationPage;
        this.rootParams = params;
    }
}