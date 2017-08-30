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
import {ChangeLanguagePage} from "./change-language/change-language";


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
            title: this.translateService.instant('profile.data.choose_picture'),
            buttons: [
                {
                    text: this.translateService.instant('profile.data.camera'),
                    handler: () => this.takePhoto('camera')
                },
                {
                    text: this.translateService.instant('profile.data.gallery'),
                    handler: () => this.takePhoto('Gallery')
                },
                {
                    text: this.translateService.instant('common.cancel'),
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

    changeLanguage() {
        this.navCtrl.push(ChangeLanguagePage, {
            'user': this.user
        });
    }

    resendVerificationEmail() {
        this.userService.resendVerificationEmail().subscribe((res) => {
            let alert = this.alertCtrl.create({
                message: this.translateService.instant('profile.data.resend_email_confirmation'),
                buttons: [this.translateService.instant('common.ok')]
            });

            alert.present();
        }, (error) => {
            this.errorService.displayErrorWithKey(error, 'error.scope.resend_verification_email')
        });
    }

    deleteAccountConfirm() {
        let alert = this.alertCtrl.create({
            title: this.translateService.instant('profile.data.delete_profile'),
            subTitle: this.translateService.instant('profile.data.confirm_delete'),
            message: this.translateService.instant('profile.data.confirm_delete_message'),
            buttons: [
                {
                    text:  this.translateService.instant('common.cancel'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('profile.data.yes_delete'),
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
