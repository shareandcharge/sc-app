import {Component} from '@angular/core';
import {NavController, ModalController, AlertController, LoadingController, Events, ItemSliding} from 'ionic-angular';
import {CarService} from "../../../services/car.service";
import {Car} from "../../../models/car";
import {CarWrapperPage} from "../car-wrapper";
import {ErrorService} from "../../../services/error.service";
import {TrackerService} from "../../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'page-my-cars',
    templateUrl: 'my-cars.html',
    providers: []
})
export class MyCarsPage {
    cars: Car[];

    constructor(public navCtrl: NavController, private carService: CarService, public modalCtrl: ModalController,
                private alertCtrl: AlertController, private loadingCtrl: LoadingController,
                public events: Events, private errorService: ErrorService, private trackerService: TrackerService, 
                private translateService: TranslateService) {
        //-- if we add/edit a car (from the modal wrapper)
        this.events.subscribe('cars:updated', () => this.getCars());
    }

    ionViewWillEnter() {
        this.getCars().subscribe(
            cars => {
                let cnt = cars.length;
                this.trackerService.track('Car list', {
                    'Screen Name': this.translateService.instant('my_cars.my_cars'),
                    'Car count': cnt,
                });

            }
        );
    };


    getCars() {
        let observable = this.carService.getCars();
        observable.subscribe(
            cars => this.cars = cars,
            error => this.errorService.displayErrorWithKey(error, this.translateService.instant('my_cars.list_my_cars'))
        );

        return observable;
    }

    addCar() {
        let modal = this.modalCtrl.create(CarWrapperPage, {
            "mode": "add"
        });
        modal.present();
    }

    editCar(car) {
        let modal = this.modalCtrl.create(CarWrapperPage, {
            "car": car,
            "mode": "edit"
        });
        modal.present();
    }

    deleteCar(car: Car, itemSliding: ItemSliding) {

        let alert = this.alertCtrl.create({
            title: this.translateService.instant('my_cars.delete_confirm_title'),
            message: this.translateService.instant('my_cars.delete_confirm_message'),
            buttons: [
                {
                    text: this.translateService.instant('common.cancel'),
                    role: 'cancel',
                    handler: () => itemSliding.close()
                },
                {
                    text: this.translateService.instant('my_cars.button_delete_text'),
                    handler: () => {
                        let loader = this.loadingCtrl.create({content: this.translateService.instant('my_cars.button_delete_content')});
                        loader.present();
                        this.carService.deleteCar(car.id)
                            .finally(() => loader.dismissAll())
                            .subscribe(
                                () => {
                                    this.events.publish('cars:updated');
                                    this.events.publish('locations:updated');   // because the markers change depending on the car
                                },
                                error => this.errorService.displayErrorWithKey(error, this.translateService.instant('my_cars.error_message_delete'))
                            )
                        ;
                    }
                }
            ]
        });
        alert.present();

    }

    doRefresh(refresher) {
        this.getCars().subscribe(
            () => refresher.complete(),
            error => this.errorService.displayErrorWithKey(error, this.translateService.instant('my_cars.list_my_cars')));
    }
}