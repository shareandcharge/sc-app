import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AddCarPage} from '../add/add-car';
import {CarService} from "../../../services/car.service";


@Component({
    selector: 'page-my-cars',
    templateUrl: 'my-cars.html',
    providers: [CarService]
})
export class MyCarsPage {
    cars = [];
    newCar: any;
    mode: any;
    noCars = false;

    constructor(public navCtrl: NavController, private navParams: NavParams, private carService: CarService) {

        this.carService.getCars().subscribe(cars => {
            this.cars = cars;
            console.log("the cars inside subscribe are ", this.cars);
        });


        this.newCar = navParams.get("newCar");
        this.mode = navParams.get("mode");

    }

    ionViewDidLoad() {
    }

    addCar() {
        this.navCtrl.setRoot(AddCarPage, {
            "mode": "add"
        });
    }

    editCar(id) {

        var index = this.cars.findIndex(c => c.id === id);

        this.navCtrl.push(AddCarPage, {
            "car": this.cars[index],
            "mode": "edit"
        });
    }
}
