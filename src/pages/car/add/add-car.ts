import {Component} from '@angular/core';
import {NavController, ViewController, ModalController, NavParams , ActionSheetController} from 'ionic-angular';
import {CarManufacturerPage} from '../manufacturer/car-manufacturer';
import {CustomizeCarPage} from '../customize/customize-car';
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
    public base64Image:string;
    car:Car;
    cars:any[];
    segmentTabs:any;


    constructor(public navCtrl:NavController, private viewCtrl:ViewController,private actionSheetCtrl : ActionSheetController, public modalCtrl:ModalController, private navParams:NavParams , private carService: CarService) {

        this.segmentTabs = 'preset';
        this.cars = navParams.get("cars");
        this.car = navParams.get("car");
        this.mode = navParams.get("mode");

        if (typeof this.car != 'undefined') {
            this.car = navParams.get("car");
        }
        else {
            this.car = new Car();
        }

        if(typeof this.cars == 'undefined'){
            this.cars = [];
        }

        this.carInfo = "";
        if (this.car.manufacturer != '') {
            this.carInfo = this.car.manufacturer + " , " + this.car.model;
            this.plateNumber = this.car.plateNumber;
        }

        /*  if(typeof this.selectedPlate != 'undefined'){
         var index =  this.cars.findIndex(c => c.plateNumber === this.selectedPlate);
         this.manufacturerName = this.cars[index].manufacturerName;
         this.model = this.cars[index].model;
         this.carInfo = this.cars[index].manufacturerName + " , " + this.cars[index].model.name;
         this.plateNumber = this.cars[index].plateNumber;
         }*/

        if (this.mode == "edit") {
            this.saveButtonText = "Update";
            this.showDeleteButton = true;
        }
        else {
            this.saveButtonText = "Save";
            this.showDeleteButton = false;
        }
    }

    ionViewDidLoad() {
    }

    addPhoto() {
        /*console.log("Add Photo");
        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
            // imageData is a base64 encoded string
            this.base64Image = "data:image/jpeg;base64," + imageData;
        }, (err) => {
            console.log(err);
        });*/
    }

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
            allowEdit: true,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
            // imageData is a base64 encoded string
            this.base64Image = "data:image/jpeg;base64," + imageData;
        }, (err) => {
            console.log(err);
        });
    }

    skipAddingCar() {
        console.log(" Skip Add Car");
        this.viewCtrl.dismiss();
    }

    customizeCar() {
        this.car.plateNumber = this.plateNumber;
        this.navCtrl.push(CustomizeCarPage, {
            "cars": this.cars,
            "mode": this.mode,
            "car": this.car
        });
    }
    selectModdel() {
        this.car.plateNumber = this.plateNumber;
        this.navCtrl.push(CarManufacturerPage, {
            "cars": this.cars,
            "mode": this.mode,
            "car": this.car
        });
    }

    deleteCar() {
        var index = this.cars.findIndex(c => c.plateNumber === this.car.plateNumber);
        this.cars.splice(index, 1);
        this.navCtrl.setRoot(MyCarsPage, {
            "cars": this.cars,
            "mode": this.mode
        });

        this.carService.deleteCar(this.car);
    }

    saveCar() {
        this.car.plateNumber = this.plateNumber;
        if (this.mode == "edit") {
            var index = this.cars.findIndex(c => c.plateNumber === this.car.plateNumber);
            this.cars[index] = this.car;
            /*  this.cars[index].plateNumber = this.plateNumber;
             this.cars[index].manufacturerName = this.manufacturerName;
             this.cars[index].model = this.model;*/

            this.carService.updateCar(this.car);
        }
        else{
            this.carService.createCar(this.car);
        }
        /*
         var car = {
         "model": this.model,
         "manufacturerName": this.manufacturerName,
         "plateNumber": this.plateNumber,
         };*/

        console.log(this.cars);
        this.navCtrl.setRoot(MyCarsPage, {
            "cars": this.cars,
            "newCar": this.car,
            "mode": this.mode
        });
    }
}