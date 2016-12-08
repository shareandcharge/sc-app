import {Component} from '@angular/core';
import {NavController, ViewController , ModalController , ActionSheetController , reorderArray} from 'ionic-angular';
import {SetTariffPage} from '../set-tariff/set-tariff';
import {Camera} from 'ionic-native';


@Component({
    selector: 'page-add-image',
    templateUrl: 'add-image.html'
})
export class AddStationImagePage {

    images:any;
    public base64Image: string;

    constructor(public navCtrl:NavController, private viewCtrl:ViewController , public modalCtrl: ModalController , private actionSheetCtrl:ActionSheetController) {
        if (typeof this.images == "undefined") {
            this.images = [];
        }
    }

    ionViewDidLoad() {
    }

    skipAddingImage() {
        this.viewCtrl.dismiss();
    }

  /*  AddImage(){
        let modal = this.modalCtrl.create(StationImageSelectPage , {
            "images": this.images
        });

        modal.onDidDismiss(data => {
            console.log('MODAL DATA ', data);
            this.images = data;
        });

        modal.present();
    }*/

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
            targetWidth: 800,
            allowEdit: true,
            targetHeight: 450
        }).then((imageData) => {
            // imageData is a base64 encoded string
            this.base64Image = "data:image/jpeg;base64," + imageData;
            this.images.push(this.base64Image);
        }, (err) => {
            console.log(err);
        });
    }

    continueAddStation() {
        this.navCtrl.push(SetTariffPage);
    }

    deleteImg(img){

        let index = this.images.indexOf(img);

        if(index > -1){
            this.images.splice(index, 1);
        }
    }

    reorderItems(indexes){
        this.images = reorderArray(this.images, indexes);
    }

}
