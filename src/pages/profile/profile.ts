import {Component} from '@angular/core';
import {NavController, ActionSheetController, Platform, Events} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {MyCarsPage} from '../car/my-cars/my-cars';
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {HelpPage} from "../help/help";
import {ErrorService} from "../../services/error.service";
import {ProfileDataPage} from "./profile-data/profile-data";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {

    email: any;
    user: User = new User();

    constructor(private navCtrl: NavController, private actionSheetCtrl: ActionSheetController,
                private auth: AuthService, private platform: Platform, private userService: UserService,
                private events: Events, private errorService: ErrorService, private translateService: TranslateService) {
        this.events.subscribe('users:updated', () => this.loadUser());
    }

    ionViewWillEnter() {
        this.loadUser();
    }

    loadUser() {
        this.user = this.auth.getUser();
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
                    text:  this.translateService.instant('profile.data.gallery'),
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

    logOut() {
        this.auth.logout();
        this.navCtrl.parent.select(0);
    }

    profileData() {
        this.navCtrl.push(ProfileDataPage);
    }

    help() {
        this.navCtrl.push(HelpPage);
    }

    myCars() {
        this.navCtrl.push(MyCarsPage);
    }

    updateUser() {
        this.userService.updateUser(this.user)
            .subscribe(
                () => {
                    this.events.publish('users:updated');
                },
                error => this.errorService.displayErrorWithKey(error, 'error.scope.update_user'));
    }
}
