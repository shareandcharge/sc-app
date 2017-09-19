import {Component, ViewChild} from '@angular/core';
import {
    NavController,
    NavParams,
    ActionSheetController,
    AlertController,
    Platform, LoadingController, Events, Content
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
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {TrackerService} from "../../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";
import {CONFIG} from '../../../config/config';


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
    showUSPlugHint: boolean;
    
    @ViewChild(Content) content: Content;

    constructor(private userService: UserService, private authService: AuthService, private configService: ConfigService,
                public formBuilder: FormBuilder, private alertCtrl: AlertController, public navCtrl: NavController,
                private actionSheetCtrl: ActionSheetController, private navParams: NavParams,
                private carService: CarService, private platform: Platform, private loadingCtrl: LoadingController,
                public events: Events, private errorService: ErrorService, private trackerService: TrackerService, 
                private translateService: TranslateService) {
        this.segmentTabs = 'preset';
        this.car = typeof navParams.get("car") !== "undefined" ? navParams.get("car") : new Car();
        this.mode = navParams.get("mode");

        this.showUSPlugHint = CONFIG.FEATURE_TOGGLES.usd_pilot;
        this.configService.getPlugTypes().subscribe((plugTypes) => {
                let selectedId = CONFIG.FEATURE_TOGGLES.usd_pilot ? 5 : undefined;
                this.plugOptions = this.addSelectedPlugs(plugTypes, selectedId);
            },
            error => this.errorService.displayErrorWithKey(error, this.translateService.instant('car.form.error_subtitle')));
        this.createErrorMessages();

        this.carForm = formBuilder.group({
            plateNumber: ['', Validators.compose([Validators.maxLength(20), Validators.minLength(4), Validators.required])],
            manufacturer: ['', Validators.required],
            model: ['', Validators.required],
            accuCapacity: ['', Validators.compose([accuCapacityValidator.isValid, Validators.required])],
            maxCharging: ['', Validators.compose([maxChargingValidator.isValid, Validators.required])],
            plugTypes: ['', plugTypesValidator.isValid],
            averageDistance: ['', averageDistanceValidator.isValid]
        });
    }

    ionViewWillEnter() {
        this.carForm.patchValue(this.car);
        let eventName = 'Started ' + (this.isAdd() ? 'Add' : 'Edit') + ' Electric Car';
        let screenName = (this.isAdd() ? this.translateService.instant('car.form.add_car') : this.translateService.instant('car.form.edit_car'));
        this.trackerService.track(eventName, {
            "Screen Name": screenName
        });

    }

    createErrorMessages() {
        this.errorMessages = {
            "plateNumber": this.translateService.instant('car.form.error_msgs.plateNumber'),
            "accuCapacity": this.translateService.instant('car.form.error_msgs.accuCapacity'),
            "manufacturer": this.translateService.instant('car.form.error_msgs.manufacturer'),
            "model": this.translateService.instant('car.form.error_msgs.model'),
            "plugTypes": this.translateService.instant('car.form.error_msgs.plugTypes'),
            "maxCharging": this.translateService.instant('car.form.error_msgs.maxCharging'),
            "averageDistance": this.translateService.instant('car.form.error_msgs.averageDistance')
        }
    }

    selectPhoto() {
        let actionSheet = this.actionSheetCtrl.create({
            title: this.translateService.instant('car.form.select_photo'),
            buttons: [
                {
                    text: this.translateService.instant('car.form.camera'),
                    handler: () => this.takePhoto('camera')
                },
                {
                    text: this.translateService.instant('car.form.media'),
                    handler: () => this.takePhoto('Gallery')
                },
                {
                    text: this.translateService.instant('common.cancel'),
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
            let loader = this.loadingCtrl.create({content: this.translateService.instant('car.form.save_car')});
            loader.present();

            let me = this;

            if (this.mode == "edit") {
                this.carService.updateCar(this.car)
                    .finally(() => loader.dismissAll())
                    .subscribe(
                        () => {
                            this.trackerService.track('Car Info Updated', {
                                'Screen Name': this.translateService.instant('car.form.edit_car')
                            });

                            this.events.publish('cars:updated');
                            this.events.publish('locations:updated');   // because the markers change depending on the car
                            this.refreshUser(); // needed !
                            me.navCtrl.parent.pop();
                        },
                        error => this.errorService.displayErrorWithKey(error, this.translateService.instant('refresh_car')));
            }
            else {
                this.carService.createCar(this.car)
                    .finally(() => loader.dismissAll())
                    .subscribe(
                        () => {
                            this.trackerService.track('Completed Add Car', {
                                'Screen Name': this.translateService.instant('car.form.add_car')
                            });

                            this.events.publish('cars:updated');
                            this.events.publish('locations:updated');   // because the markers change depending on the car
                            this.refreshUser(); // needed !
                            me.navCtrl.parent.pop();
                        },
                        error => this.errorService.displayErrorWithKey(error, this.translateService.instant('car.form.add_new_car'))
                    );
            }
        }
        else {
            this.content.scrollToTop();
        }
    }

    /**
     * We need to refresh the user as the cars are part of the user.
     * If we add a car, then change the profile, we may loose the cars again otherwise.
     * This probably will be fixed in a next version of the backend. Re-check.
     */
    refreshUser() {
        this.userService.getUser().subscribe(
            (user) => {
                this.authService.setUser(user);
                this.events.publish('user:refreshed');
            },
            (error) => {
                /**
                 * If we can't refresh the user, the token is expired, user deleted etc.
                 * For now we just logout the user (which clears the token)
                 */
                this.authService.logout();
            });
    }

    showHelp(field) {
        let message = "";

        switch (field) {
            case 'plateNumber':
                message = this.translateService.instant('car.form.message_platenumber');
                break;
            case 'maxCharging':
                message = this.translateService.instant('car.form.message_max_charging');
                break;
            case 'accuCapacity':
                message = this.translateService.instant('car.form.message_accu_capacity');
                break;
            case 'averageDistance':
                message = this.translateService.instant('car.form.message_average_distance');
                break;
        }

        if (message != "") {
            let alert = this.alertCtrl.create({
                title: this.translateService.instant('car.form.info'),
                message: message,
                buttons: [this.translateService.instant('common.ok')]
            });
            alert.present();
        }
    }

    isAdd() {
        return this.mode != 'edit';
    }

    addSelectedPlugs(options, selectedId) {
        for (let plug of options) {
            plug.selected = (plug.id == selectedId);
        }
        return options;
    }

}