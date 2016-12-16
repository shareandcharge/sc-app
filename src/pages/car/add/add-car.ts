import {Component} from '@angular/core';
import {
    NavController, ViewController, ModalController, NavParams, ActionSheetController, AlertController,
    Platform
} from 'ionic-angular';
import {CarManufacturerPage} from '../manufacturer/car-manufacturer';
import {MyCarsPage} from '../my-cars/my-cars';
import {Camera} from 'ionic-native';
import {CarService} from "../../../services/car.service";
import {Car} from '../../../models/car';


@Component({
    selector: 'page-add-car',
    templateUrl: 'add-car.html',
    providers: [CarService]
})

export class AddCarPage {
    manufacturerName:'';
    modelName:'';
    model:any;
    carInfo:any;
    imgSource:any;
    plateNumber:'';
    mode:any;
    saveButtonText:any;
    showDeleteButton:any;

    car:Car;
    cars:any[];
    segmentTabs:any;


    constructor(public navCtrl:NavController, private viewCtrl:ViewController ,private alertCtrl: AlertController ,private actionSheetCtrl : ActionSheetController, public modalCtrl:ModalController, private navParams:NavParams , private carService: CarService, public platform: Platform) {

        this.segmentTabs = 'preset';
        this.car = navParams.get("car");
        this.mode = navParams.get("mode");
        if (typeof this.car != 'undefined') {
            this.car = navParams.get("car");
        }
        else {
            this.car = new Car();
        }


        this.carInfo = "";

        if (this.car.manufacturer != '') {
            this.carInfo = this.car.manufacturer + " , " + this.car.model;
            this.plateNumber = this.car.plateNumber;
        }

        if (this.mode == "edit") {
            this.saveButtonText = "Aktualisieren";
            this.showDeleteButton = true;
        }
        else {
            this.saveButtonText = "Speichern";
            this.showDeleteButton = false;
        }
    }

    ionViewDidLoad() {
    }

    selectPhoto() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Add Photo',
            buttons: [
                {
                    text: 'Take a Photo',
                    handler: () => this.takePhoto('camera')
                },
                {
                    text: 'Add from Gallery',
                    handler: () => this.takePhoto('Gallery')
                },
                {
                    text: 'Cancel',
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
            targetWidth: 800,
            targetHeight: 800,
            correctOrientation: true
        }).then((imageData) => {
            // imageData is a base64 encoded string
            this.car.image = "data:image/jpeg;base64," + imageData;
        }, (err) => {
            console.log(err);
        });
    }

    skipAddingCar() {
        this.viewCtrl.dismiss();
    }

    selectModdel() {
        // let modal = this.modalCtrl.create(CarManufacturerPage, {
        //     "mode": this.mode,
        //     "car": this.car
        //
        // });
        // modal.present();

        this.navCtrl.push(CarManufacturerPage, {
            "mode": this.mode,
            "car": this.car
        });
    }

    deleteCar() {

        let alert = this.alertCtrl.create({
            title: 'Löschen bestätigen',
            message: 'Möchten Sie dieses Auto wirklich löschen?',
            buttons: [
                {
                    text: 'Nein',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ja, löschen',
                    handler: () => {
                        this.carService.deleteCar(this.car.id).subscribe(c => {
                            console.log("deleted car " , c);
                            this.navCtrl.setRoot(MyCarsPage, {
                                "mode": this.mode
                            });
                        });
                    }
                }
            ]
        });
        alert.present();

    }

    dummy(){
        console.log(this.car.plugTypes);
    }

    saveCar() {
        if (this.mode == "edit") {
            /*  this.cars[index].plateNumber = this.plateNumber;
             this.cars[index].manufacturerName = this.manufacturerName;
             this.cars[index].model = this.model;*/

            this.carService.updateCar(this.car).subscribe(c => {

                this.navCtrl.setRoot(MyCarsPage, {
                    "newCar": this.car,
                    "mode": this.mode
                });
                console.log("updated car " , c);
            });
        }
        else{
            console.log("created car " , this.car);
            // this.carService.createCar(this.car).subscribe( c => {
            //     console.log("created car " , c);
            //
            //     this.navCtrl.setRoot(MyCarsPage, {
            //         "newCar": this.car,
            //         "mode": this.mode
            //     });
            // });
        }
    }
}