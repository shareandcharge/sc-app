import {Component} from '@angular/core';
import {
    NavController,
    ModalController,
    NavParams,
    ActionSheetController,
    Platform, LoadingController, Events, AlertController
} from 'ionic-angular';
import {CarManufacturerPage} from './manufacturer/car-manufacturer';
import {Camera} from 'ionic-native';
import {CarService} from "../../../services/car.service";
import {Car} from '../../../models/car';
import {ConfigService} from "../../../services/config.service";


@Component({
    selector: 'page-add-car',
    templateUrl: 'car-form.html',
    providers: []
})

export class CarFormPage {
    car: Car;
    mode: any;
    segmentTabs: any;
    plugOptions: any;

    constructor(private configService : ConfigService, public navCtrl: NavController, private actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, private navParams: NavParams, private carService: CarService, private platform: Platform, private loadingCtrl: LoadingController, public events: Events, private alertCtrl: AlertController) {
        this.segmentTabs = 'preset';
        this.car = typeof navParams.get("car") !== "undefined" ? navParams.get("car") : new Car();
        this.mode = navParams.get("mode");

        this.configService.getPlugTypes().subscribe((plugTypes) => {
            this.plugOptions = plugTypes;
        });
    }

    ionViewDidLoad() {
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
            allowEdit: true,
            targetWidth: 300,
            targetHeight: 300,
            quality: 50,
            correctOrientation: true
        }).then((imageData) => {
            // imageData is a base64 encoded string
            this.car.imageBase64 = "data:image/jpeg;base64," + imageData;
        }, (err) => {
            console.log(err);
        });
    }

    skipAddingCar() {
        this.navCtrl.parent.pop();
    }

    selectModdel() {
        this.navCtrl.push(CarManufacturerPage, {
            "mode": this.mode,
            "car": this.car
        });
    }

    saveCar() {
        let loader = this.loadingCtrl.create({content: "Speichere Auto ..."});
        loader.present();

        let me = this;

        if (this.mode == "edit") {
            this.carService.updateCar(this.car)
                .finally(() => loader.dismissAll())
                .subscribe(
                    () => {
                        this.events.publish('cars:updated');
                        me.navCtrl.parent.pop();
                    },
                    error => this.displayError(<any>error, 'Auto aktualisieren'));
        }
        else {
            this.carService.createCar(this.car)
                .finally(() => loader.dismissAll())
                .subscribe(
                    () => {
                        this.events.publish('cars:updated');
                        me.navCtrl.parent.pop();
                    },
                    error => this.displayError(<any>error, 'Auto anlegen')
                );
        }
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
}