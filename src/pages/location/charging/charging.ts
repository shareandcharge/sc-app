import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ViewController} from 'ionic-angular';
import {ChargingService} from '../../../services/charging.service';
import {Connector} from "../../../models/connector";
import {LocationService} from "../../../services/location.service";
import {Location} from "../../../models/location";
import {CarService} from "../../../services/car.service";
import {ErrorService} from "../../../services/error.service";
import {Car} from "../../../models/car";

@Component({
    selector: 'page-charging',
    templateUrl: 'charging.html'
})
export class ChargingPage {
    location: Location;
    chargingTime: any;
    chargingTimeHours: any;
    chargingPrice: any;
    connector: Connector;
    hours: any;
    minutes: any;
    seconds: any;
    timer: any;
    countingDown: boolean;
    myCounter: any;
    buttonDeactive: any;
    selectedChargingTime: any;
    mouseDragging: any;
    chargingProgress: any;
    canvasX: any;
    canvasY: any;
    charging: boolean;
    priceProviderTitle: any;
    priceProviderRate: any;
    canvasImage: any;

    activeCar: Car;

    constructor(public navCtrl: NavController, private errorService: ErrorService, public navParams: NavParams, private alertCtrl: AlertController, private chargingService: ChargingService, private viewCtrl: ViewController, private locationService: LocationService, private carService: CarService) {
        this.location = navParams.get("location");
        console.log("LOCATION IS ", this.location.stations[0].connectors[0]);

        if (this.location.stations[0].connectors[0].priceprovider.private.active) {
            this.getPriceTitle("private", this.location.stations[0].connectors[0].priceprovider.private.selected);
        }

        if (this.location.stations[0].connectors[0].priceprovider.public.active) {
            this.getPriceTitle("public", this.location.stations[0].connectors[0].priceprovider.private.selected);

        }

        this.connector = this.location.stations[0].connectors[0];
        this.chargingTime = 0;
        this.chargingPrice = 0;
        this.buttonDeactive = false;
        this.mouseDragging = false;
        this.canvasX = 140;
        this.canvasY = 140;
        this.chargingProgress = this.chargingService.getChargingProgress();
        this.charging = this.chargingService.isCharging();
        this.canvasImage = new Image();
        this.canvasImage.src = 'assets/icons/battery.png';
    }

    getPriceTitle(type, selected) {
        if (type == 'private') {
            switch (selected) {
                case 'flatrate':
                    this.priceProviderTitle = "Flatrate";
                    this.priceProviderRate = this.location.stations[0].connectors[0].priceprovider.private.flatrate.flatrateRate;
                    break;
                case 'hourly':
                    this.priceProviderTitle = "Hourly";
                    this.priceProviderRate = this.location.stations[0].connectors[0].priceprovider.private.hourly.hourlyRate;
                    break;
                case 'kwh':
                    this.priceProviderTitle = "Kwh";
                    this.priceProviderRate = this.location.stations[0].connectors[0].priceprovider.private.kwh.kwhRate;
                    break;
            }
        }
        else {
            switch (selected) {
                case 'flatrate':
                    this.priceProviderTitle = "Flatrate";
                    this.priceProviderRate = this.location.stations[0].connectors[0].priceprovider.public.flatrate.flatrateRate;
                    break;
                case 'hourly':
                    this.priceProviderTitle = "Hourly";
                    this.priceProviderRate = this.location.stations[0].connectors[0].priceprovider.public.hourly.hourlyRate;
                    break;
                case 'kwh':
                    this.priceProviderTitle = "Kwh";
                    this.priceProviderRate = this.location.stations[0].connectors[0].priceprovider.public.kwh.kwhRate;
                    break;
            }
        }
    }

    ionViewDidLeave() {
        clearInterval(this.myCounter);
    }

    ionViewWillEnter() {
        this.activeCar = this.carService.getActiveCar();
    }

    ionViewDidLoad() {
        if (this.charging) {
            clearInterval(this.myCounter)
            this.myCounter = setInterval(() => {
                this.chargingTimeHours = this.makeTimeString(this.chargingService.getRemainingTime());
                this.timer = this.chargingService.getRemainingTime();
                this.updateCanvas();
            }, 1000);
            this.buttonDeactive = true;
            this.countingDown = true;
        }

        else {
            let c = <HTMLCanvasElement>document.getElementById('circleProgressBar');

            document.body.addEventListener("touchstart", function (e) {
                if (e.target == c) {
                    e.preventDefault();
                }
            }, false);
            document.body.addEventListener("touchend", function (e) {
                if (e.target == c) {
                    e.preventDefault();
                }
            }, false);
            document.body.addEventListener("touchmove", function (e) {
                if (e.target == c) {
                    e.preventDefault();
                }
            }, false);

            this.initiateCanvas();
        }

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

    checkOpeningHours() {
        if (!this.connector.isOpen()) {
            let alert = this.alertCtrl.create({
                title : 'Ladesäule geschlossen',
                message : 'Sorry, aber leider ist diese Ladesäule gerade geschlossen. Sind Sie sicher, dass Sie die ausdrückliche Erlaubnis haben, jetzt zu laden?',
                buttons: [
                    {
                        text : 'Ja',
                        handler : () => {
                            this.startCharging();
                        }
                    },
                    {
                        text : 'Nein'
                    }
                ]

            });
            alert.present();
        }
    }

    startCharging() {
        this.countingDown = true;
        this.selectedChargingTime = this.chargingTime;
        this.chargingTimeHours = this.chargingTimeHours + ":00";
        let me = this;
        me.timer = (this.hours * 3600) + (this.minutes * 60);

        me.chargingService.startCharging(me.connector.id, me.timer, me.activeCar.maxCharging).subscribe(
            (response) => {
            },
            error => this.errorService.displayErrorWithKey(error, 'Charging Start Error'));

        me.chargingProgress = me.chargingService.getChargingProgress();
        me.selectedChargingTime = me.timer;
        me.myCounter = setInterval(() => {
            this.hours = Math.floor(me.timer / 3600);
            this.minutes = Math.floor((me.timer % 3600 ) / 60);
            this.seconds = Math.floor((me.timer % 3600) % 60);

            this.hours = me.hours < 10 ? "0" + me.hours : me.hours;
            this.minutes = me.minutes < 10 ? "0" + me.minutes : me.minutes;
            this.seconds = me.seconds < 10 ? "0" + me.seconds : me.seconds;

            this.updateTimerString();
            this.updateCanvas();

            if (--this.timer < 0) {
                this.timer = 0;
                clearInterval(me.myCounter);
                this.countingDown = false;
                let chargedTimeString = me.makeTimeString(me.chargingService.chargedTime());
                this.initiateCanvas();
                this.chargingCompletedModal(chargedTimeString);
            }
        }, 1000);
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
                        let chargedTime = this.chargingService.chargedTime();

                        this.chargingService.stopCharging(this.connector.id).subscribe(
                            (response) => {
                            },
                            error => this.errorService.displayErrorWithKey(error, 'Charging Stop Error'));

                        this.chargingProgress = 0;
                        let chargedTimeString = this.makeTimeString(chargedTime);
                        this.countingDown = false;
                        clearInterval(this.myCounter);
                        this.chargingTime = 0;
                        this.timer = 0;
                        this.hours = "00";
                        this.minutes = "00";
                        this.seconds = "00";
                        this.updateTimerString();
                        this.updateCanvas();
                        this.initiateCanvas();
                        this.chargingCompletedModal(chargedTimeString);
                    }
                }
            ]
        });
        alert.present();
    }

    updateTimerString() {
        let timerString = this.hours + ':' + this.minutes + ':' + this.seconds;
        this.chargingTimeHours = timerString;
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
    }

    circleRange_touchEnd(self, e, canvas) {
        this.mouseDragging = false;
        if (!this.countingDown) {
            let rect = canvas.getBoundingClientRect();
            self.drawSlideBar(e.changedTouches[0].pageX - rect.left, e.changedTouches[0].pageY - rect.top);
        }

        if (this.activeCar != null) {
            this.locationService.getPrice(this.connector.id, {
                'timeToLoad': this.chargingTime,
                'wattPower': this.carService.getActiveCar().maxCharging
            }).subscribe((response) => {
                    this.chargingPrice = response.min
                },
                error => this.errorService.displayErrorWithKey(error, 'Car Service Error'));
        }
    }

    circleRange_mouseMove(self, e) {
        if (this.mouseDragging) {
            if (!this.countingDown) {
                self.drawSlideBar(e.offsetX, e.offsetY);
            }
        }
    }

    circleRange_touchMove(self, e, canvas) {
        if (this.mouseDragging) {
            if (!this.countingDown) {
                let rect = canvas.getBoundingClientRect();
                self.drawSlideBar(e.changedTouches[0].pageX - rect.left, e.changedTouches[0].pageY - rect.top);
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

        let h = this.hours < 10 ? "0" + this.hours : this.hours;
        let m = this.minutes < 10 ? "0" + this.minutes : this.minutes;
        let s = this.seconds < 10 ? "0" + this.seconds : this.seconds;

        let finalString = h + ':' + m + ':' + s;
        this.chargingTimeHours = finalString;

        ctx.fillStyle = '#006EF1';
        ctx.lineCap = 'square';
        ctx.beginPath();
        ctx.font = "48px Arial";
        this.chargingTimeHours = this.chargingTimeHours.substring(0, 5);
        ctx.fillText(this.chargingTimeHours, 81, c.height / 2 + 16);


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

        this.chargingTime = time;

    }

    makeTimeString(data) {
        let hours = Math.floor(data / 3600);
        let minutes = Math.floor((data % 3600 ) / 60);
        let seconds = Math.floor((data % 3600 ) % 60);

        let h = hours < 10 ? "0" + hours : hours;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;


        let finalString = h + ':' + m + ':' + s;
        return finalString;
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
        this.viewCtrl.dismiss();
    }

    chargingCompletedModal(chargedTime) {
        this.viewCtrl.dismiss({
            "chargedTime": chargedTime
        });
    }
}
