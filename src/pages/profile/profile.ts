import {Component} from '@angular/core';
import {NavController, ActionSheetController, Platform, AlertController, Events} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {AuthService} from "../../services/auth.service";
import {MapPage} from '../map/map';
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {EditEmailPage} from "./edit-email/edit-email";
import {EditNamePage} from "./edit-name/edit-name";
import {EditAddressPage} from "./edit-address/edit-address";


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {
    user:User;

    constructor(public alertCtrl: AlertController, public navCtrl: NavController, private actionSheetCtrl: ActionSheetController , public auth: AuthService, public userService: UserService, private platform: Platform, public events: Events) {
        this.user = auth.getUser();
        console.log(this.user);
    }

    ionViewDidLoad() {
    }

    dummy() {}

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

    updateUser() {
        this.userService.updateUser(this.user)
            .subscribe(
                () => {
                    this.events.publish('users:updated');
                },
                error => this.displayError(<any>error, 'Benutzer aktualisieren'));
    }

    logout() {
        this.auth.logout();
        console.log("logged Out");
        this.navCtrl.setRoot(MapPage);
    }

    displayError(message: any, subtitle?: string) {
        let alert = this.alertCtrl.create({
            title: 'Fehler',
            subTitle: subtitle,
            message: message,
            buttons: ['Schließen']
        });
        alert.present();
    }

    editEmail() {
        this.navCtrl.push(EditEmailPage, {
            'parent' : this
        });
    }

    editName() {
        this.navCtrl.push(EditNamePage, {
            'parent' : this
        });
    }

    editAddress() {
        this.navCtrl.push(EditAddressPage, {
            'parent' : this
        });
    }
}
