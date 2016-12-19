import {Component} from '@angular/core';
import {
    NavController,
    ModalController,
    NavParams,
    ActionSheetController,
    App,
    Platform, LoadingController, Events
} from 'ionic-angular';
import {CarManufacturerPage} from './manufacturer/car-manufacturer';
import {Camera} from 'ionic-native';
import {CarService} from "../../../services/car.service";
import {Car} from '../../../models/car';


@Component({
    selector: 'page-add-car',
    templateUrl: 'car-form.html',
    providers: [CarService]
})

export class CarFormPage {
    car: Car;
    mode: any;
    segmentTabs: any;

    constructor(private app: App, public navCtrl: NavController, private actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, private navParams: NavParams, private carService: CarService, private platform: Platform, private loadingCtrl: LoadingController, public events: Events) {
        this.segmentTabs = 'preset';
        this.car = typeof navParams.get("car") !== "undefined" ? navParams.get("car") : new Car();
        this.mode = navParams.get("mode");
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
        this.app.navPop();
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
            this.carService.updateCar(this.car).subscribe(() => {
                this.events.publish('cars:updated');
                me.navCtrl.parent.pop().then(() => loader.dismissAll());
            });
        }
        else {
            this.carService.createCar(this.car).subscribe((c) => {
                this.events.publish('cars:updated');
                me.navCtrl.parent.pop().then(() => loader.dismissAll());
            });
        }
    }
}