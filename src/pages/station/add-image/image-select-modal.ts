import {Component} from '@angular/core';
import {NavController, ViewController, ModalController} from 'ionic-angular';
import {Camera} from 'ionic-native';


@Component({
    selector: 'page-add-image',
    templateUrl: 'image-select-modal.html'
})
export class StationImageSelectPage {

    public base64Image:string;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, public modalCtrl: ModalController) {
    }

    ionViewDidLoad() {
    }

    skipAddingImage() {
        this.viewCtrl.dismiss();
    }

    fromCamera(){
        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
            // imageData is a base64 encoded string
            this.base64Image = "data:image/jpeg;base64," + imageData;
        }, (err) => {
            console.log(err);
        });
    }

    fromLibrary(){
        Camera.getPicture({
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
            // imageData is a base64 encoded string
            this.base64Image = "data:image/jpeg;base64," + imageData;
        }, (err) => {
            console.log(err);
        });
    }
}
