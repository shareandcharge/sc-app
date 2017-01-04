import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class ChargingService {
    //private baseUrl: string = 'https://api-test.shareandcharge.com/v1';
    private chargingTime: number = 0;
    private progress: number = 0;
    counter: any;
    timer:number = 0;

    constructor(private authHttp: AuthHttp) {
    }

    getChargingProgress() {
        return this.progress;
    }

    setChargingTime(seconds) {
        this.chargingTime = seconds;
        this.countDown(seconds);
    }

    stopCharging() {
        clearInterval(this.counter);
        this.progress = 0;
        this.chargingTime = 0;
        this.timer = 0;
    }

    getRemainingTime(){
        return this.timer;
    }

    chargedTime(){
        return this.chargingTime - this.timer;
    }

    countDown(time) {
        this.progress = 1;
        let me = this;
        me.timer = time;
        me.counter = setInterval(function () {
            if (--me.timer < 0) {
                clearInterval(me.counter);
            }
            let chargedTime = me.chargingTime - me.timer;
            me.progress = Math.floor((100 * chargedTime) / me.chargingTime);
            if(me.progress < 1){
                me.progress = 1;
            }
            console.log("progress is" , me.progress);

        }, 1000);
    }
}