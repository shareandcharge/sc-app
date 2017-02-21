import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {Events, ToastController, ModalController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {Badge} from 'ionic-native';
import {AbstractApiService} from "./abstract.api.service";
import {LocationService} from "./location.service";
import {Location} from "../../models/location";
import {AuthService} from "./auth.service";
import {ErrorService} from "./error.service";
import {ChargingCompletePage} from "../pages/location/charging/charging-complete/charging-complete"


@Injectable()
export class ChargingService extends AbstractApiService {
    private baseUrl: string = 'https://api-test.shareandcharge.com/v1';
    private chargingTime: number = 0;
    private progress: number = 0;
    counterInterval: any;
    eventInterval: any;
    timer: number = 0;
    charging: boolean;
    connectorId: any;
    location: any;

    constructor(private authHttp: AuthHttp, private events: Events, private modalCtrl: ModalController, private errorService: ErrorService, private locService: LocationService, private storage: Storage, private toastCtrl: ToastController, private auth: AuthService) {
        super();
    }

    checkChargingState() {
        if (!this.auth.loggedIn()) {
            return;
        }

        let user = this.auth.getUser();

        this.getConnectors(user.address).subscribe((res) => {
                if (!res.length) {
                    this.chargingEnd();
                    return;
                }

                /**
                 * It may be, that we have multiple connectors because
                 * we charge at multiple stations; the list also contains
                 * connectors where timeLeft=0 but have not beend removed, yet.
                 *
                 * To determine the connector for which we want to show the progress,
                 * we first remove all expired (timeLeft=0) the sort by timeLeft
                 * ascending and choose the first (the oldest).
                 */

                let connectors = res.filter(connector => connector.timeleft > 0);

                if (!connectors.length) {
                    this.chargingEnd();
                    return;
                }

                connectors.sort((a, b) => {
                    if (a === b) return 0;
                    return (a < b ) ? -1 : 1;
                });

                let connector = connectors.shift();

                this.getStation(connector.station).subscribe((res) => {
                        this.locService.getLocation(res.location).subscribe((loc) => {
                                this.location = loc;
                            },
                            error => this.errorService.displayErrorWithKey(error, 'Get Location Error'));
                    },
                    error => this.errorService.displayErrorWithKey(error, 'Get Station Error'));

                let remainingTime = Math.floor(connector.timeleft);
                if (remainingTime > 0) {
                    this.resumeCharging(remainingTime, connector.secondstorent);
                }
                else {
                    this.chargingEnd();
                }

            },
            error => this.errorService.displayErrorWithKey(error, 'Liste - Connectors'));
    }

    getConnectors(userAddress: string) {
        return this.authHttp.get(`${this.baseUrl}/connectors/?controller=${userAddress}`)
            .map(res => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getStation(stationId) {
        return this.authHttp.get(`${this.baseUrl}/stations/${stationId}`)
            .map(res => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getChargingProgress() {
        return this.progress;
    }

    isCharging() {
        return this.charging && this.auth.loggedIn();
    }

    resumeCharging(remainingTime, totalTime) {
        this.chargingTime = totalTime;
        this.charging = true;
        this.startEventInterval();
        this.countDown(remainingTime);
    }

    startCharging(connectorId, secondsToCharge, maxCharging, location) {
        this.location = location;
        this.timer = secondsToCharge;

        let chargingData = {
            "maxCharging": parseInt(maxCharging),
            "secondsToCharge": secondsToCharge
        };

        return this.authHttp.post(`${this.baseUrl}/connectors/${connectorId}/start`, JSON.stringify(chargingData), [{timeout: 3000}])
            .map(res => {
                res.json();
                this.charging = true;
                this.chargingTime = secondsToCharge;
                this.connectorId = connectorId;
                this.events.publish('charging:update', this.location, this.progress);
                this.storage.set("chargingTime", this.chargingTime);
                this.storage.set("isCharging", true);
                this.startEventInterval();
                this.countDown(secondsToCharge);

                this.events.publish('locations:updated');
            })
            .catch(this.handleError);
    }

    stopCharging(connectorId) {
        return this.authHttp.post(`${this.baseUrl}/connectors/${connectorId}/stop`, {})
            .map(res => {
                res.json();
                this.chargingEnd();
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
        this.events.publish('charging:update', this.location, this.progress);
        clearInterval(this.counterInterval);
        clearInterval(this.eventInterval);
    }

    getRemainingTime() {
        return this.timer;
    }

    getChargingTime() {
        return this.chargingTime;
    }

    getLocation(): Location {
        return this.location;
    }

    chargedTime() {
        return this.chargingTime - this.timer;
    }

    startEventInterval() {
        clearInterval(this.eventInterval);
        this.eventInterval = setInterval(() => {
            this.events.publish('charging:update', this.location, this.progress, this.charging);
        }, 1000);
    }

    countDown(time) {
        Badge.set(1);
        this.progress = 1;
        let me = this;
        me.timer = time;
        clearInterval(me.counterInterval);
        me.counterInterval = setInterval(() => {
            if (--this.timer < 0) {
                clearInterval(me.counterInterval);
                this.stopCharging(this.connectorId)
                    .subscribe(() => this.presentToast(this.chargingTime));
            }
            let chargedTime = this.chargingTime - this.timer;
            this.progress = Math.floor((100 * chargedTime) / this.chargingTime);
            if (this.progress < 1) {
                this.progress = 1;
            }
            this.storage.set("timer", this.timer);
        }, 1000);
    }

    presentToast(total) {
        let toast = this.toastCtrl.create({
            message: 'Ladevorgang erfolgreich beendet',
            showCloseButton: true,
            closeButtonText: 'Ok',
            position: 'top',
            dismissOnPageChange: false
        });

        toast.onDidDismiss(() => {
            let data = {
                "chargedTime": total,
                "location": this.location
            };

            let chargingCompletedModal = this.modalCtrl.create(ChargingCompletePage, data);
            chargingCompletedModal.present();
        });

        toast.present();
    }
}