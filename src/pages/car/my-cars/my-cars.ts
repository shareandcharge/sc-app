import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {AddCarPage} from '../add/add-car';
import {CarService} from "../../../services/car.service";
import {Car} from "../../../models/car";


@Component({
    selector: 'page-my-cars',
    templateUrl: 'my-cars.html',
    providers: [CarService]
})
export class MyCarsPage {
    cars: Car[];

    errorMessage: string;

    constructor(public navCtrl: NavController, private carService: CarService, public modalCtrl: ModalController) {
    }

    ngOnInit() {
    };

    ionViewWillEnter() {
        this.getCars();
    };

    getCars() {
        let observable = this.carService.getCars();
        observable.subscribe(
            cars => this.cars = cars,
            error => this.errorMessage = <any>error
        );

        return observable;
    }

    addCar() {
        let modal = this.modalCtrl.create(AddCarPage, {
            "mode": "add"
        });
        modal.present();
    }

    editCar(car) {
        let modal = this.modalCtrl.create(AddCarPage, {
            "car": car,
            "mode": "edit"
        });
        modal.present();
    }

    doRefresh(refresher) {
        this.getCars().subscribe(() => refresher.complete());
    }

}