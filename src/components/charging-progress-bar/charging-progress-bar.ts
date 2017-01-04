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

    constructor(private chargingService: ChargingService ,  private events:Events) {
        this.charging = this.chargingService.isCharging();
        this.progress = this.chargingService.getChargingProgress();
        let me = this;

        this.events.subscribe('charging:update', () => this.updateComponent());

        /*setInterval(function () {
            console.log("component interval");
            me.progress = me.chargingService.getChargingProgress();
        }, 1000);*/
    }

    ionViewDidLoad() {
        console.log("component  loaded *****");
    }

    updateComponent(){
        console.log("component interval");
        this.progress = this.chargingService.getChargingProgress();
    }
}

