import {Component} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
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

    constructor(public navCtrl: NavController, private navParams: NavParams, private carService: CarService, public modalCtrl: ModalController) {

        this.loadCars();

        this.newCar = navParams.get("newCar");
        this.mode = navParams.get("mode");

    }

    loadCars() {
        this.carService.getCars().subscribe(cars => {
            this.cars = cars;
            console.log("the cars inside subscribe are ", this.cars);
        });
    }

    ionViewDidLoad() {
    }

    addCar() {
        let modal = this.modalCtrl.create(AddCarPage, {
            "mode": "add"
        });
        modal.present();

        // this.navCtrl.setRoot(AddCarPage, {
        //     "mode": "add"
        // });
    }

    editCar(id) {

        var index = this.cars.findIndex(c => c.id === id);
        let modal = this.modalCtrl.create(AddCarPage, {
            "car": this.cars[index],
            "mode": "edit"
        });
        modal.present();

        // this.navCtrl.push(AddCarPage, {
        //     "car": this.cars[index],
        //     "mode": "edit"
        // });
    }

    doRefresh(refresher) {
        this.loadCars();
        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 1000);
    }

}
