import {Component} from '@angular/core';
import {NavController, ViewController, ModalController, NavParams} from 'ionic-angular';
import {CarManufacturerPage} from '../car-manufacturer/car-manufacturer';
import {CustomizeCarPage} from '../customize-car/customize-car';


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

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, public modalCtrl: ModalController, private navParams: NavParams) {

        this.manufacturerName = navParams.get("manufacturerName");
        this.model = navParams.get("model");

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
    }

    skipAddingCar(data) {
        console.log(" Skip Add Car");
        this.viewCtrl.dismiss(data);
    }

    customizeCar() {
        this.navCtrl.push(CustomizeCarPage, {
            "model": this.model,
            "manufacturerName": this.manufacturerName
        });
    }

    selectModdel() {
        this.navCtrl.push(CarManufacturerPage);
    }

    saveCar() {
        console.log("Save Car");
        this.viewCtrl.dismiss();
    }
}
