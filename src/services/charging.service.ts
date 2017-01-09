import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {Events, ToastController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {Badge} from 'ionic-native';
import {AbstractApiService} from "./abstract.api.service";


@Injectable()
export class ChargingService extends AbstractApiService {
    private baseUrl: string = 'https://api-test.shareandcharge.com/v1';
    private chargingTime: number = 0;
    private progress: number = 0;
    counter: any;
    eventInterval: any;
    timer: number = 0;
    charging: boolean;
    connectorId: any;
    public interval: any;

    constructor(private authHttp: AuthHttp, private events: Events, private storage: Storage, private toastCtrl: ToastController) {
        super();
    }

    checkChargingState() {
        console.log("checking charge state..");
        this.storage.get("isCharging").then(charging => {
            if (!charging) {
                Badge.clear();
                return
            }
            ;
            this.charging = true;
            this.storage.get("chargingTime").then(chargingTime => {
                this.chargingTime = chargingTime;
                this.storage.get("timer").then(timer => {
                    this.startEventInterval();
                    this.countDown(timer);
                });
            });
        });
    }

    getChargingProgress() {
        return this.progress;
    }

    isCharging() {
        return this.charging;
    }

    startCharging(connectorId, secondsToCharge, maxCharging) {
        this.charging = true;
        this.chargingTime = secondsToCharge;
        this.connectorId = connectorId;
        this.events.publish('charging:update', this.progress);
        this.storage.set("chargingTime", this.chargingTime);
        this.storage.set("isCharging", true);
        this.startEventInterval();
        this.countDown(secondsToCharge);

        let chargingData = {
            "maxCharging": parseInt(maxCharging),
            "secondsToCharge": secondsToCharge
        };

        return this.authHttp.post(`${this.baseUrl}/connectors/${connectorId}/start`, JSON.stringify(chargingData))
            .map(res => {
                res.json();
                this.events.publish('locations:updated');
            })
            .catch(this.handleError);
    }

    stopCharging(connectorId) {
        this.chargingEnd();
        return this.authHttp.post(`${this.baseUrl}/connectors/${connectorId}/stop`, {})
            .map(res => {
                res.json();
                this.events.publish('locations:updated');
            })
            .catch(this.handleError);
    }

    chargingEnd() {
        Badge.clear();
        this.charging = false;
        this.progress = 0;
        this.chargingTime = 0;
        this.timer = 0;
        this.connectorId = null;
        this.storage.set("isCharging", false);
        this.events.publish('charging:update', this.progress);
        clearInterval(this.counter);
        clearInterval(this.eventInterval);
    }

    getRemainingTime() {
        return this.timer;
    }

    getChargingStation() {
        return this.connectorId;
    }

    chargedTime() {
        return this.chargingTime - this.timer;
    }

    startEventInterval() {
        this.eventInterval = setInterval(() => {
            this.events.publish('charging:update', this.progress, this.charging);
        }, 1000);
    }

    countDown(time) {
        Badge.set(1);
        this.progress = 1;
        let me = this;
        me.timer = time;
        me.counter = setInterval(() => {
            if (--this.timer < 0) {
                this.chargingEnd();
                this.presentToast();
            }
            let chargedTime = this.chargingTime - this.timer;
            this.progress = Math.floor((100 * chargedTime) / this.chargingTime);
            if (this.progress < 1) {
                this.progress = 1;
            }
            this.storage.set("timer", this.timer);
        }, 1000);
    }

    presentToast() {
        console.log("Toasting");
        let toast = this.toastCtrl.create({
            message: 'Charging Completed',
            duration: 3000
        });
        toast.present();
    }
}