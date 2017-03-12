import {Component} from '@angular/core';
import {
    NavController, NavParams, AlertController, ViewController, LoadingController, Events,
    ModalController
} from 'ionic-angular';
import {ChargingService} from '../../../services/charging.service';
import {Connector} from "../../../models/connector";
import {LocationService} from "../../../services/location.service";
import {Location} from "../../../models/location";
import {CarService} from "../../../services/car.service";
import {ErrorService} from "../../../services/error.service";
import {Car} from "../../../models/car";
import {TermsPage} from "../../_global/terms";
import {Station} from "../../../models/station";

@Component({
    selector: 'page-charging',
    templateUrl: 'charging.html'
})
export class ChargingPage {
    location: Location;
    station: Station;
    connector: Connector;
    selectedConnectorId: number;

    chargingTimeHours: any;
    chargingPrice: any;
    chargingPricePerHour: any;
    chargingTypeText: string;

    includingVat: boolean;

    hours: any;
    minutes: any;
    seconds: any;
    timer: any;
    countingDown: boolean;
    buttonDeactive: any;
    termsChecked: boolean;
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

    activeCar: Car;

    priceProviderTariffTypes = [
        'invalid',
        'flatrate',
        'hourly',
        'kwh'
    ];

    constructor(public navCtrl: NavController, private errorService: ErrorService, private loadingCtrl: LoadingController,
                public navParams: NavParams, private alertCtrl: AlertController, private chargingService: ChargingService,
                private viewCtrl: ViewController, private locationService: LocationService, private carService: CarService,
                private events: Events, private modalCtrl: ModalController) {

        this.location = navParams.get("location");
        this.station = this.location.stations[0];
        this.connector = this.station.connectors[0];
        this.selectedConnectorId = this.connector.id;

        this.fromLocationDetailsAndIsCharging = navParams.get("isCharging");

        this.chargingPrice = 0;
        this.buttonDeactive = false;
        this.mouseDragging = false;
        this.canvasX = 140;
        this.canvasY = 140;
        this.canvasImage = new Image();
        this.canvasImage.src = 'assets/icons/battery.png';

        events.subscribe('charging:update', () => this.chargingUpdateEvent());
    }

    ionViewWillEnter() {
        // when we open/close the terms/AGB modal we don't want to refresh everything
        if (this.enterFromModal) {
            this.enterFromModal = false;
            return;
        }

        this.termsChecked = false;
        this.charging = this.chargingService.isCharging();
        this.activeCar = this.carService.getActiveCar();

        if (this.activeCar) {
            //-- always read+set the hourly price
            this.updatePriceInfo(60 * 60, this.activeCar.maxCharging, true);
        }

        if (this.charging && this.activeCar) {
            this.updatePriceInfo(this.chargingService.getChargingTime(), this.carService.getActiveCar().maxCharging);
        }
        else {
            let c = <HTMLCanvasElement>document.getElementById('circleProgressBar');

            let me = this;
            document.body.addEventListener("touchstart", function (e) {
                me.doScrolling = true;
                if (e.target == c) {
                    if (!me.isScrollable((e.changedTouches[0].pageX), (e.changedTouches[0].pageY))) {
                        e.preventDefault();
                        me.doScrolling = false;
                    }
                }
            }, false);
            document.body.addEventListener("touchend", function (e) {
            }, false);
            document.body.addEventListener("touchmove", function (e) {
            }, false);

            this.initiateCanvas();
        }
    }

    /**
     * called via event by the charging.service to update countdown etc.
     */
    chargingUpdateEvent() {
        this.charging = this.chargingService.isCharging();
        this.timer = this.chargingService.getRemainingTime();
        this.chargingTimeHours = this.makeTimeString(this.timer);
        this.updateCanvas();
        if (this.timer <= 0) {
            this.charging = false;
            this.countingDown = false;
            this.dismiss();
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
                this.chargingPrice = response.min;
                this.includingVat = response.vat;
                this.chargingTypeText = this.priceProviderTariffTypes[response.type];
                if (perHour) {
                    this.chargingPricePerHour = response.min;
                }
            },
            error => this.errorService.displayErrorWithKey(error, 'Preis ermitteln'));
    }

    updatePriceInfoForSetTime() {
        this.updatePriceInfo((this.hours * 3600) + (this.minutes * 60), this.carService.getActiveCar().maxCharging);
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
        let loader = this.loadingCtrl.create({content: "Ladevorgang wird gestartet ..."});
        loader.present();

        this.chargingService.startCharging(this.connector.id, this.timer, this.activeCar.maxCharging, this.location)
            .finally(() => loader.dismissAll())
            .subscribe(
                () => {
                    this.charging = true;
                    this.updatePriceInfo(this.chargingService.getChargingTime(), this.carService.getActiveCar().maxCharging);
                },
                error => this.errorService.displayErrorWithKey(error, 'Ladevorgang starten'));
    }

    stopCharging() {
        let alert = this.alertCtrl.create({
            title: 'Ladevorgang stoppen',
            message: 'Bist Du sicher, dass Du den Ladevorgang jetzt stoppen möchtest?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Ja, jetzt stoppen',
                    handler: () => {
                        this.chargedTimeAtStop = this.chargingService.chargedTime();

                        let loader = this.loadingCtrl.create({content: "Ladevorgang wird gestoppt ..."});
                        loader.present();

                        this.chargingService.stopCharging(this.connector.id)
                            .finally(() => loader.dismissAll())
                            .subscribe(
                                () => {
                                    this.countingDown = false;
                                    this.timer = 0;
                                    this.hours = "00";
                                    this.minutes = "00";
                                    this.seconds = "00";
                                    this.updateCanvas();
                                    this.initiateCanvas();
                                    this.didStop = true;
                                    this.dismiss();
                                },
                                error => this.errorService.displayErrorWithKey(error, 'Ladevorgang stoppen'));
                    }
                }
            ]
        });
        alert.present();
    }

    circleRange_mouseDown() {
        this.mouseDragging = true;
    }

    circleRange_touchStart() {
        this.mouseDragging = true;
    }

    circleRange_mouseUp(self, e) {
        this.mouseDragging = false;
        if (!this.countingDown) {
            self.drawSlideBar(e.offsetX, e.offsetY);
        }
        if (this.activeCar != null) {
            this.updatePriceInfoForSetTime();
        }

    }

    circleRange_touchEnd(self, e, canvas) {
        if (!this.doScrolling) {
            this.mouseDragging = false;
            if (!this.countingDown) {
                let rect = canvas.getBoundingClientRect();
                self.drawSlideBar(e.changedTouches[0].pageX - rect.left, e.changedTouches[0].pageY - rect.top);
            }

            if (this.activeCar != null) {
                this.updatePriceInfoForSetTime();
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

        let time = Math.floor((((8 * 60 * 60) + 100) * deg) / 360);

        this.buttonDeactive = (time <= 600) || (this.activeCar == null);
        this.hours = Math.floor(time / 3600);
        this.minutes = Math.floor(Math.floor((time % 3600 ) / 60) / 10) * 10;
        this.seconds = 0;

        // let h = this.hours < 10 ? "0" + this.hours : this.hours;
        let h = this.hours;
        let m = this.minutes < 10 ? "0" + this.minutes : this.minutes;
        let s = this.seconds < 10 ? "0" + this.seconds : this.seconds;

        this.chargingTimeHours = h + ':' + m + 'm' + s;

        ctx.fillStyle = '#006EF1';
        ctx.lineCap = 'square';
        ctx.beginPath();
        ctx.font = "48px Arial";
        this.chargingTimeHours = this.chargingTimeHours.substring(0, 4);
        ctx.fillText(this.chargingTimeHours, 94, c.height / 2 + 16);

        ctx.font = "12px Arial";
        ctx.fillText('Std.', 97, c.height / 2 + 35);
        ctx.fillText('Min.', 149, c.height / 2 + 35);

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
    }

    makeTimeString(data) {

        let hours = Math.floor(data / 3600);
        let minutes = Math.floor((data % 3600 ) / 60);
        let seconds = Math.floor((data % 3600 ) % 60);

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
        let fullCircle = 2 * Math.PI;
        let progress = ((fullCircle * this.timer) / (8 * 3600)) - (Math.PI / 2);

        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.canvasX, this.canvasY, 97, 1.5 * Math.PI, progress);
        ctx.stroke();

    }

    dismiss() {
        this.viewCtrl.dismiss({
            "didStop": this.didStop,
            "chargedTime": this.chargedTimeAtStop,
            "isCharging": this.charging,
            "fromLocationDetailsAndIsCharging": this.fromLocationDetailsAndIsCharging
        });
    }

    openTerms() {
        let modal = this.modalCtrl.create(TermsPage);
        modal.present().then(() => this.enterFromModal = true);
    }

    selectConnector() {
        this.connector = this.station.connectors.filter(
            (c: Connector) => {
                return c.id == this.selectedConnectorId;
            })[0];
        this.updatePriceInfoForSetTime();
    }
}
