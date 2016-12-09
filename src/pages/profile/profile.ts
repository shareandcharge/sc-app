import {Component} from '@angular/core';
import {NavController, ActionSheetController} from 'ionic-angular';
import {Camera} from 'ionic-native';


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {
    public base64Image: string;

    constructor(public navCtrl: NavController, private actionSheetCtrl: ActionSheetController) {
    }

    ionViewDidLoad() {
    }

    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Add Photo',
            buttons: [
                {
                    text: 'Take a Photo',
                    handler: () => {
                        this.takePhoto('camera');
                    }
                }, {
                    text: 'Add from Gallery',
                    handler: () => {
                        this.takePhoto('Gallery');
                    }
                }, {
                    text: 'Cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
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
            this.base64Image = "data:image/jpeg;base64," + imageData;
        }, (err) => {
            console.log(err);
        });
    }

}
