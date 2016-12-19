import {Component} from '@angular/core';
import {NavController, ModalController, AlertController, LoadingController, Events, ItemSliding} from 'ionic-angular';
import {CarService} from "../../../services/car.service";
import {Car} from "../../../models/car";
import {CarWrapperPage} from "../car-wrapper";


@Component({
    selector: 'page-my-cars',
    templateUrl: 'my-cars.html',
    providers: []
})
export class MyCarsPage {
    cars: Car[];

    constructor(public navCtrl: NavController, private carService: CarService, public modalCtrl: ModalController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, public events: Events) {
        //-- if we add/edit a car (from the modal wrapper)
        this.events.subscribe('cars:updated', () => this.getCars());
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
            error => this.displayError(<any>error, 'Liste - Meine Autos')
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
            title: 'Löschen bestätigen',
            message: 'Möchten Sie dieses Auto wirklich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    handler: () => itemSliding.close()
                },
                {
                    text: 'Ja, löschen',
                    handler: () => {
                        let loader = this.loadingCtrl.create({content: "Lösche Auto ..."});
                        loader.present();
                        this.carService.deleteCar(car.id)
                            .finally(() => loader.dismissAll())
                            .subscribe(
                                () => this.events.publish('cars:updated'),
                                error => this.displayError(<any>error, 'Auto löschen')
                            )
                        ;
                    }
                }
            ]
        });
        alert.present();

    }

    doRefresh(refresher) {
        this.getCars().subscribe(() => refresher.complete());
    }

    displayError(message: any, subtitle?: string) {
        let alert = this.alertCtrl.create({
            title: 'Fehler',
            subTitle: subtitle,
            message: message,
            buttons: ['Schließen']
        });
        alert.present();
    }
}