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
import {TrackerService} from "../../../services/tracker.service";
import {LocationService} from "../../../services/location.service";
import {TranslateService} from "@ngx-translate/core";


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

    constructor(public navCtrl: NavController, private alertCtrl: AlertController, private navParams: NavParams,
                public modalCtrl: ModalController, private actionSheetCtrl: ActionSheetController,
                private events: Events, private trackerService: TrackerService, private locationService: LocationService, 
                private translateService: TranslateService) {
        if (typeof this.images == "undefined") {
            this.images = [];
        }

        this.locObject = this.navParams.get("location");
        this.flowMode = this.navParams.get("mode");

        this.station = this.locObject.stations[0];
        this.connector = this.station.connectors[0];

        if (this.locObject.hasImages()) {
            this.images = this.locationService.getImagesWithSrc(this.locObject);
        }
    }

    ionViewDidEnter() {
        this.trackerService.track('Started Photo - ' + (this.isAdd() ? 'Add' : 'Edit'), {});
    }

    close() {
        this.navCtrl.parent.pop();
    }

    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: this.translateService.instant('station.choose_photo'),
            buttons: [
                {
                    text: this.translateService.instant('station.camera'),
                    handler: () => {
                        this.takePhoto('camera');
                    }
                }, {
                    text: this.translateService.instant('station.gallery'),
                    handler: () => {
                        this.takePhoto('Gallery');
                    }
                }, {
                    text: this.translateService.instant('common.cancel'),
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

        this.trackerService.track('Save Photo - ' + (this.isAdd() ? 'Add' : 'Edit'), {});

        if (this.connector.atLeastOneTarifSelected()) {
            this.events.publish('locations:update', this.locObject);
        } else {
            this.navCtrl.push(SetTariffPage, {
                "location": this.locObject,
                "mode": this.flowMode,
                "setTariffAlert": true
            });
        }
    }

    continueAddStation() {
        this.prepareProcedure();

        this.trackerService.track('Proceed Photo - ' + (this.isAdd() ? 'Add' : 'Edit'), {});

        this.navCtrl.push(PlugTypesPage, {
            "location": this.locObject,
            "mode": this.flowMode
        });
    }

    deleteImg(img, itemSliding: ItemSliding) {
        let alert = this.alertCtrl.create({
            title: this.translateService.instant('station.confirm_delete'),
            message: this.translateService.instant('station.msg_confirm_delete'),
            buttons: [
                {
                    text: this.translateService.instant('common.cancel'),
                    role: 'cancel',
                    handler: () => itemSliding.close()
                },
                {
                    text: this.translateService.instant('station.yes_delete'),
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

    isAdd() {
        return this.flowMode == 'add';
    }

    getImageSrc(image) {
        return image.src && 'data:' == image.src.substr(0, 5) ? image.src : this.locationService.getImageSrc(image);
    }
}
