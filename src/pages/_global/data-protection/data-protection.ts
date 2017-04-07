import {Component} from '@angular/core';
import {Events, ViewController} from 'ionic-angular';
import {ConfigService} from "../../../services/config.service";
import {InAppBrowser} from "ionic-native";
import {TrackerService} from "../../../services/tracker.service";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {ErrorService} from "../../../services/error.service";

@Component({
    selector: 'page-data-protection',
    templateUrl: 'data-protection.html'
})
export class DataProtectionPage {

    isTrackingDisabled: boolean = true;

    constructor(private viewCtrl: ViewController, private configService: ConfigService,
                private trackerService: TrackerService, private authService: AuthService,
                private userService: UserService, private events: Events, private errorService: ErrorService) {
    }

    ionViewWillEnter() {
        this.isTrackingDisabled = this.trackerService.isDisabled();
    }

    openExternalDataProtection() {
        let url = this.configService.get('DATA_PROTECTION_URL');
        new InAppBrowser(url, '_blank', 'presentationstyle=fullscreen,closebuttoncaption=Schließen,toolbar=yes,location=no');
    }

    toggleCheckbox() {
        if (this.isTrackingDisabled) {
            this.trackerService.disable();
        }
        else {
            this.trackerService.enable();
        }

        if (this.authService.loggedIn()) {
            let user: User = this.authService.getUser();

            if (this.isTrackingDisabled) {
                user.trackingDisable();
            }
            else {
                user.trackingEnable();
            }

            this.userService.updateUser(user)
                .subscribe(
                    (user: User) => {
                        this.authService.setUser(user);
                        this.events.publish('users:updated');
                    },
                    error => this.errorService.displayErrorWithKey(error, 'Benutzer aktualisieren'));

        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
