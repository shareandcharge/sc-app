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
import { Car } from "../../../models/car";
import { Station } from "../../../models/station";
import { TrackerService } from "../../../services/tracker.service";
import { InAppBrowser } from "ionic-native";
import { ConfigService } from "../../../services/config.service";
import { TranslateService } from "@ngx-translate/core";

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
    tariffType: number;
    tariffValue: any;
    
    max_kwh: any;
    kwh_ammount: any;

    // max_kwh implement later when we have maxkwh in tariffs

    price: any;
    priceComponents: any;
    tariffs: any;
    selectedTariff: any;
    estimatedPrice: number;

    includingVat: boolean;

    hours: any;
    minutes: any;
    seconds: any;
    timer: any;
    _countingDown: boolean;
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

    finalizeButton: boolean;
    stopButtonClicked: boolean;
    stopButtonDisabled: boolean = false;

    activeCar: Car;

    maxChargingMinutes: number = 8 * 60;
    maxChargingMinutesFlatrate: number = 4 * 60;

    @ViewChild(Content) content: Content;


    constructor(public navCtrl: NavController, private errorService: ErrorService, private loadingCtrl: LoadingController,
        public navParams: NavParams, private alertCtrl: AlertController, private chargingService: ChargingService,
        private viewCtrl: ViewController, private locationService: LocationService, private carService: CarService,
        private events: Events, private modalCtrl: ModalController, private trackerService: TrackerService,
        private configService: ConfigService, private translateService: TranslateService) {

        this.location = navParams.get("location");
        //-- for now we use the first station
        this.station = this.location.stations[0];
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

        this.estimatedPrice = this.price;

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

        this.termsChecked = false;
        this.charging = this.chargingService.isCharging();
        this.activeCar = this.carService.getActiveCar();

        if (true) {
            //-- always read+set the hourly price
            this.updatePriceInfo(60 * 60, 30, true);
        }

        if (this.charging) {
            // this.startCheckConnector();
            // this.updatePriceInfo(this.chargingService.getChargingTime(), this.carService.getActiveCar().maxCharging);
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
            // this.chargingPrice = response.min;
            // this.includingVat = response.vat;
            // this.tariffType = response.type;
            // this.chargingTypeText = this.priceProviderTariffTypes[response.type];
            // if (perHour) {
            //     this.chargingPricePerHour = response.min / 100;
            // }
            this.priceComponents = response.priceComponents;
            const energy = this.priceComponents.filter(pc => pc.priceComponents.type === 'ENERGY')[0];
            const time = this.priceComponents.filter(pc => pc.priceComponents.type === 'TIME')[0];
            const flat = this.priceComponents.filter(pc => pc.priceComponents.type === 'FLAT')[0];
            
            if (time) {
                this.selectedTariff = 'TIME';
                this.price = time.priceComponents.price;
            } else if (energy) {
                this.selectedTariff = 'ENERGY';
                this.price = energy.priceComponents.price;
            } else if (flat) {
                this.selectedTariff = 'FLAT';
                this.price = flat.priceComponents.price;
            } else {
                this.selectedTariff = '???';
                this.price = 0;
            }
            
            this.estimatedPrice = this.price;

            this.tariffs = this.priceComponents.map(obj => {
                return obj.priceComponents;
            });

        },
            error => this.errorService.displayErrorWithKey(error, this.translateService.instant('location.charging.find_price')));
    }

    tariffSelect() {
        const energy = this.priceComponents.filter(pc => pc.priceComponents.type === 'ENERGY')[0];
        const time = this.priceComponents.filter(pc => pc.priceComponents.type === 'TIME')[0];
        const flat = this.priceComponents.filter(pc => pc.priceComponents.type === 'FLAT')[0];
        switch(this.selectedTariff) {
            case 'TIME':
                this.price = time.priceComponents.price * 100;
                this.estimatedPrice = this.price;
                break;
            case 'FLAT': 
                this.estimatedPrice = flat.priceComponents.price * 100;
                break;
            case 'ENERGY':
                this.price = energy.priceComponents.price * 100;
                this.estimatedPrice = this.price;
                break;
            default:
                this.price = 0;
                this.estimatedPrice = this.price;
        } 

        this.initiateCanvas();
    }


    updatePriceInfoForSetTime() {
        this.updatePriceInfo((this.hours * 3600) + (this.minutes * 60), 30);
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

        if(this.selectedTariff === 'ENERGY'){
            this.tariffValue = this.kwh_ammount * 1000;
            //kWh to wats for backend
        } else {
            this.tariffValue = this.timer;
            //this is going to be in seconds
        }
        
        this.chargingService.startCharging(this.connector, this.tariffValue, this.selectedTariff, this.estimatedPrice, this.location)
            .finally(() => loader.dismissAll())
            .subscribe(
                () => {
                    this.trackerService.track('Charging Started', {
                        'id': this.location.id,
                        'Address': this.location.address,
                        'Timestamp': ''
                    });
                    
                    this.charging = true;
                    // this.startCheckConnector();
                    // this.updatePriceInfo(this.chargingService.getChargingTime(), this.carService.getActiveCar().maxCharging);
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

    doStopCharging() {
        this.chargedTimeAtStop = this.chargingService.chargedTime();
        this.stopButtonClicked = true;

        let loader = this.loadingCtrl.create({ content: this.translateService.instant('location.charging.end_charging') });
        loader.present();

        this.chargingService.stopCharging(this.connector.id)
            .subscribe(
                () => {
                    loader.dismiss().then(() => {
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
                    });

                },
                error => {
                    loader.dismiss();
                    this.errorService.displayErrorWithKey(error, this.translateService.instant('location.charging.stop_charging'))
                });

    }

    circleRange_mouseDown() {
        this.mouseDragging = true;
        this.finalizeButton = false;
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

        this.buttonDeactive = (time <= 600) || (this.activeCar == null);
        this.hours = Math.floor(time / 3600);
        this.minutes = Math.floor(Math.floor((time % 3600) / 60) / 10) * 10;
        this.seconds = 0;

        //
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

        if(this.selectedTariff !== 'ENERGY'){
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

        if(this.selectedTariff === 'ENERGY'){
            this.kwh_ammount = Math.floor(((this.getMaxChargingMinutesForCurrentTariff()) * deg) / 360) + 1;
            this.estimatedPrice = this.kwh_ammount * this.price;
            
            //display ammount of kWh
            this.chargingTimeHours = this.kwh_ammount;
            if(this.chargingTimeHours < 10){
                ctx.fillText(this.chargingTimeHours, 130, c.height / 2 + 16);
            } else if(this.chargingTimeHours > 9 && this.chargingTimeHours <= 99) {
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
        let timeInMinutes = this.timer / 60;
        
        const pricePerMinute  = this.price / 60;
        
        if(this.selectedTariff !== 'FLAT' && this.selectedTariff !== 'ENERGY'){
            this.estimatedPrice = Math.round(pricePerMinute * timeInMinutes) || this.price;
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
        let fullCircle = 2 * Math.PI;
        //progress timebased
        let progress = ((fullCircle * this.timer) / (this.getMaxChargingMinutesForCurrentTariff() * 60)) - (Math.PI / 2);

        // implement progress for kwh here ->


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
        })
            .catch((e) => {
                // console.log('view was not dismissed', e)
            });
    }

    openTerms() {
        let url = this.translateService.instant('documents.TERMS_STATION_URL');
        let close = this.translateService.instant('common.close')
        new InAppBrowser(url, '_blank', 'presentationstyle=fullscreen,closebuttoncaption=' + close + ',toolbar=yes,location=no');
    }

    selectConnector() {
        this.connector = this.station.connectors.filter(
            (c: Connector) => {
                return c.id == this.selectedConnectorId;
            })[0];
        this.updatePriceInfoForSetTime();
    }

    getMaxChargingMinutesForCurrentTariff() {

        if(this.selectedTariff == 'ENERGY'){
            return this.max_kwh;
        }
        return this.selectedTariff == 'FLAT' ? this.maxChargingMinutesFlatrate : this.maxChargingMinutes;
        
    }
}
