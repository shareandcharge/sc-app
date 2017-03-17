import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NotificationsPage} from "../notifications/notifications";

@Component({
    selector: 'page-account-settings',
    templateUrl: 'account-settings.html'
})
export class AccountSettingsPage {

    constructor(private navCtrl: NavController) {
    }

    notifications() {
        this.navCtrl.push(NotificationsPage);
    }
}