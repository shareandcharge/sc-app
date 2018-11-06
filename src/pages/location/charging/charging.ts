import { Component, ViewChild } from '@angular/core';
import {
    NavController, NavParams, AlertController, ViewController, LoadingController, Events,
    ModalController, Content
} from 'ionic-angular';
import { ChargingService } from '../../../services/charging.service';
import { Connector } from "../../../models/connector";
import { LocationService } from "../../../services/location.service";
import { Location } from "../../../models/location";
import { CarService } from "../../../services/car.service";
import { ErrorService } from "../../../services/error.service";
import { Station } from "../../../models/station";
import { TrackerService } from "../../../services/tracker.service";
// import { InAppBrowser } from "ionic-native";
import { ConfigService } from "../../../services/config.service";
import { TranslateService } from "@ngx-translate/core";

import { App } from 'ionic-angular';

@Component({
    selector: 'page-charging',
    templateUrl: 'charging.html'
})
export class ChargingPage {

    // @ViewChild(Content) content : Content;
    // @ViewChild('scrollablePanel') panel : ElementRef;

    location: Location;
    station: Station;
    connector: Connector;
    evses: any;
    selectedEvse: any;
    selectedConnectorId: number;
    plugTypeId: any;

    chargingTimeHours: any;
    chargingPrice: any;
    tariffValue: any;
    showTariffs: boolean;
    allTariffs: any;

    timeStepSize: number;
    energyStepSize: any;
    steps: any;

    max_kwh: any;
    kwh_ammount: any;

    price: any;
    price_components: any;
    tariffs: any;
    selectedTariff: any;
    estimatedPrice: number;
    currency: string;

    hours: any;
    minutes: any;
    seconds: any;
    timer: any;
    _countingDown: boolean;
    buttonDeactive: any;
    enterFromModal: boolean;
    mouseDragging: any;
    canvasX: any;
    canvasY: any;
    charging: boolean;
    canvasImage: any;
    doScrolling: boolean = true;
    fromLocationDetailsAndIsCharging: boolean = false;
    didStop: boolean = false;
    chargedTimeAtStop: any;

    finalizeButton: boolean;
    stopButtonClicked: boolean;
    stopButtonDisabled: boolean = false;

    // set maximum charging time here
    maxChargingMinutes: number = 3 * 60;
    maxChargingMinutesFlatrate: number = 2 * 60;

    @ViewChild(Content) content: Content;


    constructor(public navCtrl: NavController, private errorService: ErrorService, private loadingCtrl: LoadingController,
        public navParams: NavParams, private alertCtrl: AlertController, private chargingService: ChargingService,
        private viewCtrl: ViewController, private locationService: LocationService, private carService: CarService,
        private events: Events, private modalCtrl: ModalController, private trackerService: TrackerService,
        private configService: ConfigService, private translateService: TranslateService,

        private app: App
    ) {
        this.showTariffs = false;
        this.location = navParams.get("location");
        //-- for now we use the first station
        this.station = this.location.stations[0];

        this.evses = this.location.evses;
        this.selectedEvse = this.evses[0].evse_id;

        //-- first non rented connector is default (innogy stations have two+)
        this.connector = this.station.connectors.find((connector) => {
            return !connector.isRented;
        });

        if (this.connector) {
            this.selectedConnectorId = this.connector.id;
        }

        this.fromLocationDetailsAndIsCharging = navParams.get("isCharging");

        this.chargingPrice = 0;
        this.buttonDeactive = false;
        this.mouseDragging = false;
        this.canvasX = 140;
        this.canvasY = 140;
        this.canvasImage = new Image();
        this.canvasImage.src = 'assets/icons/battery.png';
        this.finalizeButton = true;

        this.estimatedPrice = 0;

        // max_kwh implement when max_kwh in tariffs
        this.max_kwh = 100;
        this.kwh_ammount = 1;

        events.subscribe('charging:update', () => this.chargingUpdateEvent());
    }

    ionViewWillEnter() {
        // when we open/close the terms/AGB modal we don't want to refresh everything
        if (this.enterFromModal) {
            this.enterFromModal = false;
            return;
        }

        this.stopButtonClicked = false;
        this.trackerService.track('Charging Page Entered', {
            'id': this.location.id,
            'Address': this.location.address,
            'Timestamp': ''
        });

        this.charging = this.chargingService.isCharging();

        if (true) {
            //-- always read+set the hourly price
            this.updatePriceInfo(60 * 60, 30, false);
        }

        if (this.charging) {
            // this.startCheckConnector();
        }
        else {
            let c = <HTMLCanvasElement>document.getElementById('circleProgressBar');
            let x = document.getElementById('all-content');
            let me = this;

            document.body.addEventListener("touchstart", function (e) {
                me.doScrolling = true;
                if (e.target == c) {
                    if (!me.isScrollable((e.changedTouches[0].pageX), (e.changedTouches[0].pageY))) {
                        x.className = 'content-white no-scroll';
                        e.preventDefault();
                        me.doScrolling = false;
                    }
                }
            }, false);
            document.body.addEventListener("touchend", function (e) {
                x.className = 'content-white';
            }, false);
            document.body.addEventListener("touchmove", function (e) {
            }, false);

            this.initiateCanvas();

            this.chargingService.stopped.subscribe(() => this.dismiss());
        }

    }

    /**
     * we use setters and getters to track changes to
     * the var, because the val also changes the height of the footer
     * and we need to call content.resize() when the size of
     * the footer changes
     * @param val
     */
    set countingDown(val: boolean) {
        let changed = this._countingDown !== val;
        this._countingDown = val;

        if (changed) {
            this.content.resize();
        }
    }

    get countingDown(): boolean {
        return this._countingDown;
    }

    /**
     * called via event by the charging.service to update countdown etc.
     */
    chargingUpdateEvent() {
        this.charging = this.chargingService.isCharging();
        this.timer = this.chargingService.getRemainingTime();
        this.timer = this.timer > 0 ? this.timer : 0;
        this.chargingTimeHours = this.makeTimeString(this.timer);
        this.updateCanvas();
        if (this.timer <= 0) {
            // this.charging = false;
            this.countingDown = false;
            //-- we don't want to close everything here if the stop button has been clicked
            //      he will take care then.
            if (!this.stopButtonClicked) {
                // this.dismiss();
            }
        }

        if (this.charging) {
            this.buttonDeactive = true;
            this.countingDown = true;
        }
    }

    updatePriceInfo(secondsToCharge, maxCharging, perHour: boolean = false) {
        this.locationService.getPrice(this.connector.id, {
            'secondsToCharge': secondsToCharge,
            'maxCharging': maxCharging
        }).subscribe((response) => {
            this.allTariffs = response;
            this.estimatedPrice = 0;
        },
            error => this.errorService.displayErrorWithKey(error, this.translateService.instant('location.charging.find_price')));
    }

    /**
     * We take relevant tariff for a connector and use that tariff to calculate price and charge
    */
    getRelevantTariff(plugTypeId) {

        let theEvse = this.evses.filter(obj => obj.evse_id === this.selectedEvse);
        let theConnector = theEvse[0].connectors.filter(obj => obj.id === plugTypeId);

        let theTariff = this.allTariffs[theConnector[0].tariff_id];
        this.currency = theTariff.currency;
        this.price_components = theTariff.elements;

        const energy = this.price_components.filter(pc => pc.price_components[0].type === 'ENERGY')[0];
        const time = this.price_components.filter(pc => pc.price_components[0].type === 'TIME')[0];
        const flat = this.price_components.filter(pc => pc.price_components[0].type === 'FLAT')[0];

        this.tariffs = this.price_components.map(obj => {
            return obj.price_components[0];
        });

        if (time) {
            this.selectedTariff = 'TIME';
            this.price = time.price_components[0].price * 100;
            this.timeStepSize = time.price_components[0].step_size;
        } else if (energy) {
            this.selectedTariff = 'ENERGY';
            this.price = energy.price_components[0].price * 100;
            this.energyStepSize = energy.price_components[0].step_size;
        } else if (flat) {
            this.selectedTariff = 'FLAT';
            this.price = flat.price_components[0].price * 100;
        } else {
            this.selectedTariff = '???';
            this.price = 0;
        }
    }

    evseSelect() {
        // getting all connectors for sellected evse
        let x = this.evses.filter(obj => {
            return obj.evse_id === this.selectedEvse
        });

        let inputs = x[0].connectors.map(obj => {
            return {
                type: 'radio',
                label: obj.standard,
                value: obj.id
            }
        });

        let alert = this.alertCtrl.create({
            title: 'Please sellect your connector',
            inputs: inputs,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'OK',
                    handler: (data: string) => {
                        this.plugTypeId = data;
                        this.showTariffs = true;
                        this.getRelevantTariff(this.plugTypeId);
                    }
                }
            ]
        });
        alert.present();
    }

    tariffSelect() {
        const energy = this.price_components.filter(pc => pc.price_components[0].type === 'ENERGY')[0];
        const time = this.price_components.filter(pc => pc.price_components[0].type === 'TIME')[0];
        const flat = this.price_components.filter(pc => pc.price_components[0].type === 'FLAT')[0];
        switch (this.selectedTariff) {
            case 'TIME':
                this.price = time.price_components[0].price * 100;
                this.estimatedPrice = this.price;
                this.timeStepSize = time.price_components[0].step_size +1;
                break;
            case 'FLAT':
                this.price = flat.price_components[0].price * 100;
                this.estimatedPrice = this.price;
                break;
            case 'ENERGY':
                this.price = energy.price_components[0].price * 100;
                this.estimatedPrice = this.price;
                this.energyStepSize = energy.price_components[0].step_size;
                break;
            default:
                this.price = 0;
                this.estimatedPrice = this.price;
        }
        this.initiateCanvas();
    }

    isScrollable(x, y) {
        let c = <HTMLCanvasElement>document.getElementById('circleProgressBar');
        let rect = c.getBoundingClientRect();

        let minRadius = 90;
        let maxRadius = 120;
        let centerX = 140;
        let centerY = 140;

        x = x - rect.left - centerX;
        y = y - rect.top - centerY;

        let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        let scrollable = (distance > minRadius) && (distance < maxRadius);
        return !scrollable;
    }

    initiateCanvas() {
        let c = <HTMLCanvasElement>document.getElementById('circleProgressBar');

        c.addEventListener('mousedown', (e) => this.circleRange_mouseDown(), false);
        c.addEventListener('touchstart', (e) => this.circleRange_touchStart(), false);

        c.addEventListener('mouseup', (e) => this.circleRange_mouseUp(this, e), false);
        c.addEventListener('touchend', (e) => this.circleRange_touchEnd(this, e, c), false);

        c.addEventListener('mousemove', (e) => this.circleRange_mouseMove(this, e), false);
        c.addEventListener('touchmove', (e) => this.circleRange_touchMove(this, e, c), false);

        let ctx: CanvasRenderingContext2D = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        this.drawSlideBar(this.canvasX + 1, 10);
    }

    startCharging() {
        this.timer = (this.hours * 3600) + (this.minutes * 60);
        let loader = this.loadingCtrl.create({ content: this.translateService.instant('location.charging.begin_charging') });
        loader.present();

        this.tariffValue;

        if (this.selectedTariff === 'ENERGY') {
            this.tariffValue = this.kwh_ammount * 1000;
            //kWh to wats for backend
        } else {
            this.tariffValue = this.timer;
            //this is going to be in seconds
        }

        this.chargingService.startCharging(this.connector, this.selectedEvse, this.plugTypeId, this.tariffValue, this.selectedTariff, this.estimatedPrice, this.location)
            .finally(() => loader.dismissAll())
            .subscribe(
                () => {
                    this.trackerService.track('Charging Started', {
                        'id': this.location.id,
                        'Address': this.location.address,
                        'Timestamp': ''
                    });

                    this.charging = true;
                },
                error => this.errorService.displayErrorWithKey(error, this.translateService.instant('location.charging.start_charging')));
    }

    startCheckConnector() {
        this.stopButtonDisabled = true;
        this.chargingService.checkCurrentConnectorIsPending().subscribe(pending => {
            if (pending) {
                setTimeout(() => this.startCheckConnector(), 4000);
            }
            else {
                this.stopButtonDisabled = false;
            }
        });
    }

    stopCharging() {
        let alert = this.alertCtrl.create({
            title: this.translateService.instant('location.charging.stop_charging'),
            message: this.translateService.instant('location.charging.stop_confirmation'),
            buttons: [
                {
                    text: this.translateService.instant('common.cancel'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('location.charging.stop_yes'),
                    handler: () => {
                        alert.dismiss().then(() => this.doStopCharging());
                        return false;
                    }
                }
            ]
        });
        alert.present();
    }

    handleChargingEnd() {
        this.trackerService.track('Charging Stopped', {
            'id': this.location.id,
            'Address': this.location.address,
            'Timestamp': ''
        });
        this.countingDown = false;
        this.timer = 0;
        this.hours = "00";
        this.minutes = "00";
        this.seconds = "00";
        this.updateCanvas();
        this.initiateCanvas();
        this.didStop = true;
        this.dismiss();
    }

    doStopCharging() {
        this.chargedTimeAtStop = this.chargingService.chargedTime();
        this.stopButtonClicked = true;

        let loader = this.loadingCtrl.create({ content: this.translateService.instant('location.charging.end_charging') });
        loader.present();

        this.chargingService.stopCharging(this.connector.id, this.selectedEvse)
            .subscribe(
                () => {
                    loader.dismiss().then(() => this.dismiss());
                },
                error => {
                    loader.dismiss();
                    this.errorService.displayErrorWithKey(error, this.translateService.instant('location.charging.stop_charging'))
                });

    }

    circleRange_mouseDown() {
        this.mouseDragging = true;
        this.finalizeButton = false;
        this.doScrolling = false;
    }

    circleRange_touchStart() {
        this.mouseDragging = true;
        this.finalizeButton = false;
    }

    circleRange_mouseUp(self, e) {
        this.mouseDragging = false;
        if (!this.countingDown) {
            self.drawSlideBar(e.offsetX, e.offsetY);
        }
    }

    circleRange_touchEnd(self, e, canvas) {
        if (!this.doScrolling) {
            this.mouseDragging = false;
            if (!this.countingDown) {
                let rect = canvas.getBoundingClientRect();
                self.drawSlideBar(e.changedTouches[0].pageX - rect.left, e.changedTouches[0].pageY - rect.top);
            }
        }
    }

    circleRange_mouseMove(self, e) {
        if (!this.doScrolling) {
            if (this.mouseDragging) {
                if (!this.countingDown) {
                    self.drawSlideBar(e.offsetX, e.offsetY);
                }
            }
        }
    }

    circleRange_touchMove(self, e, canvas) {
        if (!this.doScrolling) {
            if (this.mouseDragging) {
                if (!this.countingDown) {
                    let rect = canvas.getBoundingClientRect();
                    self.drawSlideBar(e.changedTouches[0].pageX - rect.left, e.changedTouches[0].pageY - rect.top);
                }
            }
        }
    }

    drawSlideBar(x, y) {
        let atan = Math.atan2(x - this.canvasX, y - this.canvasY);
        // degrees circle
        let deg = -atan / (Math.PI / 180) + 180;
        let c = <HTMLCanvasElement>document.getElementById('circleProgressBar');
        let ctx: CanvasRenderingContext2D = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);

        ctx.lineWidth = 26;
        ctx.strokeStyle = '#E6F0FD';
        ctx.beginPath();
        ctx.arc(this.canvasX, this.canvasY, 110, 0, 2 * Math.PI);
        ctx.stroke();

        let gradientLightened = ctx.createLinearGradient(0, 0, 360, 0);
        gradientLightened.addColorStop(0, '#C4C7DE');
        gradientLightened.addColorStop(1, '#D5DDF7');

        let gradient = ctx.createLinearGradient(0, 0, 360, 0);
        gradient.addColorStop(0, '#A46EF1');
        gradient.addColorStop(1, '#006EF1');

        ctx.strokeStyle = gradientLightened;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.canvasX, this.canvasY, 97, 0, 2 * Math.PI);
        ctx.stroke();

        let time = Math.floor((((this.getMaxChargingMinutesForCurrentTariff() * 60) + 100) * deg) / 360);

        this.hours = Math.floor(time / 3600);
        // charging selection, 1 minute step
        this.minutes = Math.floor(Math.floor((time % 3600) / 60) / 1) * 1;
        this.seconds = 0;

        // let h = this.hours < 10 ? "0" + this.hours : this.hours;
        let h = this.hours;
        let m = this.minutes < 10 ? "0" + this.minutes : this.minutes;
        let s = this.seconds < 10 ? "0" + this.seconds : this.seconds;

        this.chargingTimeHours = h + ':' + m + 'm' + s;

        //color for time display
        ctx.fillStyle = '#006EF1';
        ctx.lineCap = 'square';
        ctx.beginPath();
        ctx.font = "48px Arial";

        if (this.selectedTariff !== 'ENERGY') {
            //display time
            this.chargingTimeHours = this.chargingTimeHours.substring(0, 4);
            ctx.fillText(this.chargingTimeHours, 94, c.height / 2 + 16);

            //display units
            ctx.font = "12px Arial";
            let hoursString = this.translateService.instant('location.charging.hour');
            let minutesString = this.translateService.instant('location.charging.minutes');
            ctx.fillText(hoursString, 97, c.height / 2 + 35);
            ctx.fillText(minutesString, 149, c.height / 2 + 35);
        }

        if (this.selectedTariff === 'ENERGY') {
            this.kwh_ammount = Math.floor(((this.getMaxChargingMinutesForCurrentTariff()) * deg) / 360);
            this.steps = this.kwh_ammount / this.energyStepSize;
            this.estimatedPrice = Math.ceil(this.steps * this.price);

            //display ammount of kWh
            this.chargingTimeHours = this.kwh_ammount;
            if (this.chargingTimeHours < 10) {
                ctx.fillText(this.chargingTimeHours, 130, c.height / 2 + 16);
            } else if (this.chargingTimeHours > 9 && this.chargingTimeHours <= 99) {
                ctx.fillText(this.chargingTimeHours, 115, c.height / 2 + 16);
            } else {
                ctx.fillText(this.chargingTimeHours, 105, c.height / 2 + 16);
            }

            //display units
            ctx.font = "12px Arial";
            let kwh = this.translateService.instant('location.charging.kwh');
            ctx.fillText(kwh, 130, c.height / 2 + 35);
        }

        ctx.strokeStyle = gradient;
        ctx.beginPath();
        let radiant = (deg * Math.PI / 180) - (0.5 * Math.PI);
        ctx.arc(this.canvasX, this.canvasY, 97, 1.5 * Math.PI, radiant);
        ctx.stroke();

        let endOfArcX = Math.round(this.canvasX + Math.cos(radiant) * 100);
        let endOfArcY = Math.round(this.canvasY + Math.sin(radiant) * 100);

        ctx.fillStyle = 'white';
        ctx.shadowBlur = 3;
        ctx.shadowColor = "black";
        ctx.beginPath();
        ctx.arc(endOfArcX, endOfArcY, 15, 0, 2 * Math.PI);
        ctx.fill();

        ctx.shadowBlur = 0;

        // estimating price 
        this.timer = (this.hours * 3600) + (this.minutes * 60); // in seconds
        this.steps = Math.floor(this.timer / (this.timeStepSize + 1)) + 1;
        

        // estimated price for TIME tariff
        if (this.selectedTariff !== 'FLAT' && this.selectedTariff !== 'ENERGY') {
            this.estimatedPrice = Math.ceil(this.steps * this.price);
        }

    }

    makeTimeString(data) {

        let hours = Math.floor(data / 3600);
        let minutes = Math.floor((data % 3600) / 60);
        let seconds = Math.floor((data % 3600) % 60);

        let h = hours < 10 ? "0" + hours : hours;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;

        return h + ':' + m + ':' + s;
    }


    updateCanvas() {
        let c = <HTMLCanvasElement>document.getElementById('circleProgressBar');
        if (!c) return;

        let ctx: CanvasRenderingContext2D = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);

        ctx.drawImage(this.canvasImage, 110, 85);
        ctx.lineWidth = 26;
        ctx.strokeStyle = '#E6F0FD';
        ctx.beginPath();
        ctx.arc(this.canvasX, this.canvasY, 110, 0, 2 * Math.PI);
        ctx.stroke();

        let gradientLightened = ctx.createLinearGradient(0, 0, 360, 0);
        gradientLightened.addColorStop(0, '#C4C7DE');
        gradientLightened.addColorStop(1, '#D5DDF7');

        let gradient = ctx.createLinearGradient(0, 0, 360, 0);
        gradient.addColorStop(0, '#A46EF1');
        gradient.addColorStop(1, '#006EF1');

        ctx.strokeStyle = gradientLightened;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.arc(this.canvasX, this.canvasY, 97, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = '#006EF1';
        ctx.lineCap = 'square';
        ctx.beginPath();
        ctx.font = "30px Arial";

        if (this.selectedTariff !== 'ENERGY') {
            let fullCircle = 2 * Math.PI;
            //progress timebased
            let max = this.tariffValue;

            let timeRemaining;
            if (this.selectedTariff === 'FLAT') {
                timeRemaining = fullCircle * this.timer;
            } else {
                timeRemaining = (fullCircle * (max - (this.timer || 1)));
            }

            let progress = (timeRemaining / max) - (Math.PI / 2);

            // implement progress for kwh here ->

            if (this.timer <= max) {
                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.canvasX, this.canvasY, 97, 1.5 * Math.PI, progress);
                ctx.stroke();
            }
        }
    }

    dismiss() {
        this.viewCtrl.dismiss({
            "didStop": this.didStop,
            "chargedTime": this.chargedTimeAtStop,
            "isCharging": this.charging,
            "fromLocationDetailsAndIsCharging": this.fromLocationDetailsAndIsCharging
        })
            .catch((e) => {
                // console.log('view was not dismissed', e)
            });
    }

    getMaxChargingMinutesForCurrentTariff() {
        if (this.selectedTariff == 'ENERGY') {
            return this.max_kwh;
        }
        return this.selectedTariff == 'FLAT' ? this.maxChargingMinutesFlatrate : this.maxChargingMinutes;
    }
}
