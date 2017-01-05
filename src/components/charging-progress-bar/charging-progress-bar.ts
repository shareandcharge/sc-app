import {Component, Input} from '@angular/core';
import {ChargingService} from '../../services/charging.service';
import {Events} from "ionic-angular";

@Component({
    selector: 'charging-progress-bar',
    templateUrl: 'charging-progress-bar.html'
})
export class ChargingProgressBarComponent {
    @Input('progress') progress;
    charging: boolean;

    constructor(private chargingService: ChargingService, private events: Events) {
        this.charging = this.chargingService.isCharging();
        this.progress = this.chargingService.getChargingProgress();

        this.events.subscribe('charging:update', (progress , charging) => this.updateComponent(progress , charging));

    }

    ionViewDidLoad() {
        console.log("component  loaded *****");
    }

    updateComponent(progress , charging) {
        this.progress = progress;
        this.charging = charging;
    }
}

