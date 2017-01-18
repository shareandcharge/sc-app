import {Component} from '@angular/core';
import {
    NavController,
    ModalController,
    NavParams,
    ActionSheetController,
    AlertController,
    Platform, LoadingController, Events
} from 'ionic-angular';
import {CarManufacturerPage} from './manufacturer/car-manufacturer';
import {Camera} from 'ionic-native';
import {CarService} from "../../../services/car.service";
import {Car} from '../../../models/car';
import {ConfigService} from "../../../services/config.service";
import {ErrorService} from "../../../services/error.service";
import {FormBuilder, Validators} from '@angular/forms';
import {plugTypesValidator} from '../../../validators/plugTypesValidator';
import {averageDistanceValidator} from '../../../validators/averageDistanceValidator';
import {maxChargingValidator} from '../../../validators/maxChargingValidator';
import {accuCapacityValidator} from '../../../validators/accuCapacityValidator';
import {PushNotificationService} from "../../../services/push.notification.service";
import {AuthService} from "../../../services/auth.service";


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
    errorMessages: any;
    carForm: any;
    submitAttempt: boolean = false;

    constructor(private configService: ConfigService, public formBuilder: FormBuilder, public alertCtrl: AlertController, public navCtrl: NavController, private actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, private navParams: NavParams, private carService: CarService, private platform: Platform, private loadingCtrl: LoadingController, public events: Events, private errorService: ErrorService, private pushNotifcationService: PushNotificationService, private authService: AuthService) {
        this.segmentTabs = 'preset';
        this.car = typeof navParams.get("car") !== "undefined" ? navParams.get("car") : new Car();
        this.mode = navParams.get("mode");
        this.configService.getPlugTypes().subscribe((plugTypes) => {
                this.plugOptions = plugTypes;
            },
            error => this.errorService.displayErrorWithKey(error, 'Liste - Steckertypen'));
        this.createErrorMessages();

        this.carForm = formBuilder.group({
            plateNumber: ['', Validators.compose([Validators.maxLength(20), Validators.minLength(4), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            manufacturer: ['', Validators.required],
            model: ['', Validators.required],
            accuCapacity: ['', Validators.compose([accuCapacityValidator.isValid, Validators.required])],
            maxCharging: ['', Validators.compose([maxChargingValidator.isValid, Validators.required])],
            plugTypes: [[''], plugTypesValidator.isValid],
            averageDistance: ['', averageDistanceValidator.isValid]
        });
    }

    createErrorMessages() {
        this.errorMessages = {
            "plateNumber": 'Bitte gib das Kennzeichen an.',
            "accuCapacity": 'Bitte gib die Batteriekapazität an.',
            "manufacturer": 'Bitte gib die Hersteller an',
            "model": 'Bitte gib das Modell an',
            "plugTypes": 'Bitte gib den Steckertyp an.',
            "maxCharging": 'Bitte gib die maximale Stromstärke an.',
            "averageDistance": 'Bitte gib die Durchschnittliche Reichweite an.'
        }
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
        this.submitAttempt = true;
        this.segmentTabs = 'custom';

        if (this.carForm.valid) {
            console.log("car form is valid");
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
                        error => this.errorService.displayErrorWithKey(error, 'Auto aktualisieren'));
            }
            else {
                this.carService.createCar(this.car)
                    .finally(() => loader.dismissAll())
                    .subscribe(
                        () => {
                            this.events.publish('cars:updated');
                            me.navCtrl.parent.pop();
                        },
                        error => this.errorService.displayErrorWithKey(error, 'Auto anlegen')
                    );
            }

            this.pushNotifcationService.registerPushNotification(this.authService.getUser());
        }
        else {
            console.log("car form is invalid");
        }
    }

    showHelp(field) {
        let message = "";

        switch (field) {
            case 'plateNumber':
                message = "z.B: AA-BB 777";
                break;
            case 'maxCharging':
                message = "max 200";
                break;
            case 'accuCapacity':
                message = "max 150";
                break;
            case 'averageDistance':
                message = "max 1000 , whole number";
                break;
        }

        if (message != "") {
            let alert = this.alertCtrl.create({
                title: 'Info',
                message: message,
                buttons: ['Ok']
            });
            alert.present();
        }
    }
}