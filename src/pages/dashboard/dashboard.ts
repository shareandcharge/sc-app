import {Component} from '@angular/core';
import {NavController, ActionSheetController, Platform, Events, ModalController} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {MyCarsPage} from '../car/my-cars/my-cars';
import {AccountSettingsPage} from './account-settings/account-settings';
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {HelpPage} from "../help/help";
import {ErrorService} from "../../services/error.service";
import {IntroPage} from "../intro/intro";


@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html'
})
export class DashboardPage {

    email: any;
    user: User = new User();

    constructor(public navCtrl: NavController, private modalCtrl: ModalController, private actionSheetCtrl: ActionSheetController, public auth: AuthService, public platform: Platform, public userService: UserService, public events: Events, private errorService: ErrorService) {
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
        }, (err) => {
            console.log(err);
        });
    }

    logOut() {
        console.log("logout");
        this.auth.logout();
        this.navCtrl.parent.select(0);
    }

    feedback() {

    }

    intro() {
        let introModal = this.modalCtrl.create(IntroPage);
        introModal.present();
    }

    settings() {
        this.navCtrl.push(AccountSettingsPage);
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
                error => this.errorService.displayErrorWithKey(error, 'Benutzer aktualisieren'));
    }
}
