import {Component, Input} from '@angular/core';
import {ChargingService} from '../../services/charging.service';


@Component({
    selector: 'charging-progress-bar',
    templateUrl: 'charging-progress-bar.html'
})
export class ChargingProgressBarComponent {
    @Input('progress') progress;

    constructor(private chargingService: ChargingService) {
        let me = this;
        this.progress = 0;
        setInterval(function () {
            me.progress = me.chargingService.getChargingProgress();
        }, 1000);
    }
}