import {Component, Input} from '@angular/core';
import {ChargingService} from '../../services/charging.service';
import {Events, ModalController} from "ionic-angular";
import {ChargingPage} from '../../pages/location/charging/charging';
import {ChargingCompletePage} from '../../pages/location/charging/charging-complete/charging-complete';
import {Car} from "../../models/car";
import {CarService} from "../../services/car.service";

@Component({
    selector: 'charging-progress-bar',
    templateUrl: 'charging-progress-bar.html'
})
export class ChargingProgressBarComponent {
    @Input('progress') progress;
    charging: boolean;
    location: any;
    activeCar: Car;

    constructor(private chargingService: ChargingService, private carService: CarService, private modalCtrl: ModalController, private events: Events) {
        this.charging = this.chargingService.isCharging();
        this.progress = this.chargingService.getChargingProgress();

        this.events.subscribe('charging:update', (location, progress, charging) => this.updateComponent(location, progress, charging));
        this.events.subscribe('auth:logout', (location, progress, charging) => this.updateComponent(location, progress, charging));
        this.events.subscribe('auth:login', (location, progress, charging) => this.updateComponent(location, progress, charging));
    }

    updateComponent(location, progress, charging) {
        this.location = location;
      /*  this.progress = progress;
        this.charging = charging;*/

        this.charging = this.chargingService.isCharging();
        this.progress = this.chargingService.getChargingProgress();
        this.activeCar = this.carService.getActiveCar();
    }

    goToCharging() {
        let chargingModal = this.modalCtrl.create(ChargingPage, {
            'location': this.location
        });

        chargingModal.onDidDismiss(data => {
            if (data) {
                data.location = this.location;
                let chargingCompletedModal = this.modalCtrl.create(ChargingCompletePage, data);
                chargingCompletedModal.present();
            }
        });
        chargingModal.present();
    }
}

