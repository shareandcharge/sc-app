import {Component} from '@angular/core';
import {
    NavController,
    ModalController,
    ActionSheetController,
    reorderArray,
    NavParams, ItemSliding, AlertController, Events
} from 'ionic-angular';
import {PlugTypesPage} from '../plug-types/plug-types';
import {Camera} from 'ionic-native';
import {Location} from "../../../models/location";
import {Station} from "../../../models/station";
import {Connector} from "../../../models/connector";
import {SetTariffPage} from "../set-tariff/set-tariff";


@Component({
    selector: 'page-add-image',
    templateUrl: 'add-image.html'
})
export class AddStationImagePage {

    images: any;
    public base64Image: string;
    locObject: Location;
    station: Station;
    connector: Connector;
    flowMode: any;

    constructor(public navCtrl: NavController, private alertCtrl: AlertController, private navParams: NavParams, public modalCtrl: ModalController, private actionSheetCtrl: ActionSheetController, private events: Events) {
        if (typeof this.images == "undefined") {
            this.images = [];
        }

        this.locObject = this.navParams.get("location");
        this.flowMode = this.navParams.get("mode");

        this.station = this.locObject.stations[0];
        this.connector = this.station.connectors[0];

        if (typeof this.locObject.images != 'undefined') {
            this.images = this.locObject.images;
        }
    }

    close() {
        this.navCtrl.parent.pop();
    }

    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Foto auswählen',
            buttons: [
                {
                    text: 'Kamera',
                    handler: () => {
                        this.takePhoto('camera');
                    }
                }, {
                    text: 'Mediathek',
                    handler: () => {
                        this.takePhoto('Gallery');
                    }
                }, {
                    text: 'Abbrechen',
                    role: 'cancel'
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
            targetHeight: 450,
            quality: 70,
            allowEdit: true,
            correctOrientation: true
        }).then((imageData) => {
            // imageData is a base64 encoded string
            this.base64Image = imageData;

            let image = {
                'data': this.base64Image,
                'src': 'data:image/jpeg;base64,' + imageData
            };

            this.images.push(image);
        }, (err) => {
            console.log(err);
        });
    }

    prepareProcedure() {
        this.locObject.images = this.images;
    }

    saveChanges() {
        this.prepareProcedure();

        if (this.connector.atLeastOneTarifSelected()) {
            this.events.publish('location:update', this.locObject);
        } else {
            this.navCtrl.push(SetTariffPage, {
                "location": this.locObject,
                "mode": this.flowMode,
                "setTariffAlert" : true
            });
        }
    }

    continueAddStation() {
        this.prepareProcedure();
        this.navCtrl.push(PlugTypesPage, {
            "location": this.locObject,
            "mode": this.flowMode
        });
    }

    deleteImg(img, itemSliding: ItemSliding) {
        let alert = this.alertCtrl.create({
            title: 'Löschen bestätigen',
            message: 'Möchtest Du dieses Foto wirklich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    handler: () => itemSliding.close()
                },
                {
                    text: 'Ja, löschen',
                    handler: () => {
                        let index = this.images.indexOf(img);

                        if (index > -1) {
                            this.images.splice(index, 1);
                        }

                    }
                }
            ]
        });
        alert.present();
    }

    reorderItems(indexes) {
        this.images = reorderArray(this.images, indexes);
    }

}
