import {Component} from '@angular/core';
import {NavController, AlertController, LoadingController} from 'ionic-angular';
import {ProfilePage} from '../../profile/profile'
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {NotificationsPage} from "../../notifications/notifications";
import {ErrorService} from "../../../services/error.service";

@Component({
    selector: 'page-account-settings',
    templateUrl: 'account-settings.html'
})
export class AccountSettingsPage {

    constructor(private navCtrl: NavController, private authService: AuthService, private userService: UserService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private errorService: ErrorService) {
    }


    deleteAccountConfirm() {
        let alert = this.alertCtrl.create({
            title: 'Profil löschen',
            subTitle: 'Löschen bestätigen',
            message: 'Möchtest Du Dein Profil und Deine Daten wirklich unwiderruflich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel'
                },
                {
                    text: 'Ja, löschen',
                    handler: () => {
                        let navTransition = alert.dismiss();

                        let loader = this.loadingCtrl.create({content: "Lösche Profil ..."});
                        loader.present();

                        this.userService.deleteUser()
                            .finally(() => loader.dismissAll())
                            .subscribe(
                                () => {
                                    navTransition.then(() => {
                                        this.authService.logout();
                                        this.navCtrl.parent.select(0);
                                    });
                                },
                                error => this.errorService.displayErrorWithKey(error, 'Profil löschen')
                            )
                        ;
                    }
                }
            ]
        });
        alert.present();

    }

    profile() {
        this.navCtrl.push(ProfilePage);
    }

    notifications() {
        this.navCtrl.push(NotificationsPage);
    }
}