import {Component} from '@angular/core';
import {NavController, ViewController , ModalController , ActionSheetController , reorderArray , NavParams} from 'ionic-angular';
import {PlugTypesPage} from '../plug-types/plug-types';
import {Camera} from 'ionic-native';
import {Location} from "../../../models/location";


@Component({
    selector: 'page-add-image',
    templateUrl: 'add-image.html'
})
export class AddStationImagePage {

    images:any;
    public base64Image: string;
    locObject: Location;
    flowMode: any;

    constructor(public navCtrl:NavController, private viewCtrl:ViewController , private navParams : NavParams,public modalCtrl: ModalController , private actionSheetCtrl:ActionSheetController) {
        if (typeof this.images == "undefined") {
            this.images = [];
        }

        this.locObject = this.navParams.get("location");
        this.flowMode = this.navParams.get("mode");


        if(typeof this.locObject.images != 'undefined') {
            this.images = this.locObject.images;
        }
    }

    ionViewDidLoad() {
    }

    skipAddingImage() {
        this.navCtrl.parent.pop();
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
            this.base64Image = imageData;

            let image = {
                'data' : this.base64Image,
                'src' : 'data:image/jpeg;base64,' + imageData
            };

            this.images.push(image);
        }, (err) => {
            console.log(err);
        });
    }

    continueAddStation() {
        this.locObject.images = this.images;
        this.navCtrl.push(PlugTypesPage , {
            "location" : this.locObject,
            "mode": this.flowMode
        });
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
