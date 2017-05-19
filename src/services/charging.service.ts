import {Injectable} from "@angular/core";
import {Events} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {AbstractApiService} from "./abstract.api.service";
import {LocationService} from "./location.service";
import {AuthService} from "./auth.service";
import {ErrorService} from "./error.service";
import {ConfigService} from "./config.service";
import {HttpService} from "./http.service";
import {Connector} from "../models/connector";
import {Location} from "../models/location";
import {Observable} from "rxjs/Observable";


/**
 * published events
 * ================
 * "charging:update": when the charging status/progress changes (on start, stop, and every second during chargin)
 * "charging:lapsed": when charging process is lapsed/run out (without the user hitting the stop button)
 */


@Injectable()
export class ChargingService extends AbstractApiService {
    private chargingTime: number = 0;
    private progress: number = 0;
    counterInterval: any;
    eventInterval: any;
    timer: number = 0;
    charging: boolean;
    connector: Connector;
    location: Location;

    constructor(private httpService: HttpService, configService: ConfigService, private events: Events,
                private errorService: ErrorService, private locService: LocationService, private storage: Storage,
                private auth: AuthService) {
        super(configService);
        this.events.subscribe('auth:logout', () => this.handleLogout());
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

                let connector: Connector = connectors.shift();

                this.getStation(connector.station).subscribe((res) => {
                        this.locService.getLocation(res.location).subscribe((loc) => {
                                this.location = loc;
                            },
                            error => this.errorService.displayErrorWithKey(error, 'Get Location Error'));
                    },
                    error => this.errorService.displayErrorWithKey(error, 'Get Station Error'));

                let remainingTime = Math.floor(connector.timeleft);
                if (remainingTime > 0) {
                    this.connector = connector;
                    this.resumeCharging(remainingTime, connector.secondstorent);
                }
                else {
                    this.chargingEnd();
                }

            },
            error => this.errorService.displayErrorWithKey(error, 'Liste - Connectors'));
    }

    getConnectors(userAddress: string) {
        return this.httpService.get(`${this.baseUrl}/connectors/?controller=${userAddress}`)
            .map(res => {
                return res.json();
            })
            .catch(this.handleError);
    }

    checkCurrentConnectorIsPending(): Observable<boolean> {
        let id = this.connector.id;

        return this.httpService.get(`${this.baseUrl}/connectors/${id}`)
            .map(res => {
                let connector = new Connector().deserialize(res.json());
                return connector.isPending();
            })
            .catch(this.handleError);
    }

    getStation(stationId) {
        return this.httpService.get(`${this.baseUrl}/stations/${stationId}`)
            .map(res => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getChargingProgress() {
        return this.auth.loggedIn() ? this.progress : 0;
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

    startCharging(connector: Connector, secondsToCharge, maxCharging, location: Location) {
        let chargingData = {
            "maxCharging": parseInt(maxCharging),
            "secondsToCharge": secondsToCharge
        };

        return this.httpService.post(`${this.baseUrl}/connectors/${connector.id}/start`, JSON.stringify(chargingData), [{timeout: 3000}])
            .map(res => {
                res.json();
                this.charging = true;
                this.chargingTime = secondsToCharge;
                this.timer = secondsToCharge;
                this.location = location;
                this.connector = connector;
                this.publishCharginUpdateEvent();
                this.storage.set("chargingTime", this.chargingTime);
                this.storage.set("isCharging", true);
                this.startEventInterval();
                this.countDown(secondsToCharge);

                this.events.publish('locations:updated');
            })
            .catch(this.handleError);
    }

    stopCharging() {
        return this.httpService.post(`${this.baseUrl}/connectors/${this.connector.id}/stop`, {})
            .map(res => {
                res.json();
                this.chargingEnd();
                this.events.publish('locations:updated');
            })
            .catch(this.handleError);
    }

    handleLogout() {
        this.chargingEnd();
    }

    chargingEnd() {
        clearInterval(this.counterInterval);
        clearInterval(this.eventInterval);

        /**
         * Do not reset location, connector, chargingTime, timer here!
         * We still need these after the charging has stopped.
         */
        this.charging = false;
        this.progress = 0;

        this.publishCharginUpdateEvent();
        this.storage.set("isCharging", false);
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

    getConnector(): Connector {
        return this.connector;
    }

    chargedTime(): number {
        return this.chargingTime - this.timer;
    }

    startEventInterval() {
        clearInterval(this.eventInterval);
        this.eventInterval = setInterval(() => {
            this.publishCharginUpdateEvent();
        }, 1000);
    }

    countDown(time) {
        this.progress = 1;
        let me = this;
        me.timer = time;
        clearInterval(me.counterInterval);
        me.counterInterval = setInterval(() => {
            if (--this.timer < 0) {
                clearInterval(me.counterInterval);
                this.stopCharging()
                    .subscribe(
                        () => this.events.publish('charging:lapsed'),
                        error => this.errorService.displayErrorWithKey(error, 'Ladevorgang stoppen')
                    );
            }
            let chargedTime = this.chargingTime - this.timer;
            this.progress = Math.floor((100 * chargedTime) / this.chargingTime);
            if (this.progress < 1) {
                this.progress = 1;
            }
            this.storage.set("timer", this.timer);
        }, 1000);
    }

    publishCharginUpdateEvent() {
        this.events.publish('charging:update', this.location, this.connector, this.progress);
    }
}