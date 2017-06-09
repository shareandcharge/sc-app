import {Component} from '@angular/core';
import {
    NavController, ActionSheetController, Platform, Events, AlertController,
    LoadingController, Alert
} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {EditEmailPage} from "./edit-email/edit-email";
import {EditProfilePage} from "./edit-profile/edit-profile";
import {ErrorService} from "../../../services/error.service";
import {EditPasswordPage} from "./edit-password/edit-password";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'page-profile',
    templateUrl: 'profile-data.html'
})
export class ProfileDataPage {
    user: User = new User();

    constructor(private navCtrl: NavController, private actionSheetCtrl: ActionSheetController,
                private authService: AuthService, private userService: UserService, private platform: Platform,
                private events: Events, private errorService: ErrorService, private alertCtrl: AlertController,
                private loadingCtrl: LoadingController, private translateService: TranslateService) {
        this.events.subscribe('users:updated', () => this.loadUser());
    }

    ionViewWillEnter() {
        this.loadUser();
    }

    loadUser() {
        this.user = this.authService.getUser();
    }

    selectPhoto() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Bild auswählen',
            buttons: [
                {
                    text: 'Kamera',
                    handler: () => this.takePhoto('camera')
                },
                {
                    text: 'Mediathek',
                    handler: () => this.takePhoto('Gallery')
                },
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    icon: !this.platform.is('ios') ? 'close' : null
                }
            ]
        });
        actionSheet.present();
    }

    takePhoto(type) {
        let sourceType;
        if (type == 'camera') {
            sourceType = Camera.PictureSourceType.CAMERA;
        }
        else {
            sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        }
        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            targetWidth: 1000,
            allowEdit: true,
            targetHeight: 1000
        }).then((imageData) => {
            this.user.profile.imageBase64 = "data:image/jpeg;base64," + imageData;
            this.updateUser();

        });
    }

    updateUser() {
        this.userService.updateUser(this.user)
            .subscribe(
                () => {
                    this.authService.setUser(this.user);
                    this.events.publish('users:updated');
                },
                error => this.errorService.displayErrorWithKey(error, 'error.scope.update_user'));
    }

    editEmail() {
        this.navCtrl.push(EditEmailPage, {
            'user': this.user
        });
    }

    editProfile() {
        this.navCtrl.push(EditProfilePage, {
            'user': this.user
        });
    }

    editPassword() {
        this.navCtrl.push(EditPasswordPage, {
            'user': this.user
        });
    }

    resendVerificationEmail() {
        this.userService.resendVerificationEmail().subscribe((res) => {
            let alert = this.alertCtrl.create({
                message: 'Die Bestätigungsemail wurde erneut versandt. Bitte prüfe Deinen Posteingang. In seltenen Fällen kann die E-Mail auch im Spamordner gelandet sein.',
                buttons: ['Ok']
            });

            alert.present();
        }, (error) => {
            this.errorService.displayErrorWithKey(error, 'error.scope.resend_verification_email')
        });
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
                        this.doDeleteAccount(alert);
                        return false;
                    }
                }
            ]
        });
        alert.present();
    }

    doDeleteAccount(alert: Alert) {
        let navTransition = alert.dismiss();

        let loader = this.loadingCtrl.create({content: this.translateService.instant('loading.delete_user')});
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
                error => this.errorService.displayErrorWithKey(error, 'error.scope.delete_user')
            )
        ;
    }
}
