import {Component, Input} from '@angular/core';
import {ChargingService} from '../../services/charging.service';


@Component({
    selector: 'charging-progress-bar',
    templateUrl: 'charging-progress-bar.html'
})
export class ChargingProgressBarComponent {
    @Input('progress') progress;
    charging: boolean;

    constructor(private chargingService: ChargingService) {
        this.charging = this.chargingService.isCharging();
        this.progress = this.chargingService.getChargingProgress();
        let me = this;

        setInterval(function () {
            console.log("component interval");
            me.progress = me.chargingService.getChargingProgress();
        }, 1000);
    }

    ionViewDidLoad() {
        console.log("component  loaded *****");
    }
}

