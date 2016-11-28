import {Component} from '@angular/core';
import {NavController, ViewController, ModalController, NavParams} from 'ionic-angular';
import {CarManufacturerPage} from '../car-manufacturer/car-manufacturer';
import {CustomizeCarPage} from '../customize-car/customize-car';
import {Camera} from 'ionic-native';



@Component({
    selector: 'page-add-car',
    templateUrl: 'add-car.html'
})
export class AddCarPage {
    manufacturerName: '';
    modelName: '';
    model: any;
    carInfo: any;
    imgSource: any;
    plateNumber: '';
    public base64Image: string;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, public modalCtrl: ModalController, private navParams: NavParams) {

        this.manufacturerName = navParams.get("manufacturerName");
        this.model = navParams.get("model");
        this.plateNumber = navParams.get("plateNumber");

        this.carInfo = "";
        if (typeof this.manufacturerName != 'undefined' && typeof this.model != 'undefined') {
            this.carInfo = this.manufacturerName + " , " + this.model.name;
            this.imgSource = this.model.img;
        }
    }

    ionViewDidLoad() {
    }

    addPhoto() {
        console.log("Add Photo");
        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
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
        this.navCtrl.push(CustomizeCarPage, {
            "model": this.model,
            "manufacturerName": this.manufacturerName,
            "plateNumber" : this.plateNumber
        });
    }

    selectModdel() {
        this.navCtrl.push(CarManufacturerPage , {
            "plateNumber" : this.plateNumber
        });
    }

    saveCar() {
        console.log("Save Car");
        this.viewCtrl.dismiss();
    }
}
