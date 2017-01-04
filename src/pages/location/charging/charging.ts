import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {ChargingCompletePage} from './charging-complete/charging-complete';
import {Badge} from 'ionic-native';
import {ChargingService} from '../../../services/charging.service';

@Component({
    selector: 'page-charging',
    templateUrl: 'charging.html'
})
export class ChargingPage {
    location: any;
    chargingTime: any;
    chargingTimeHours: any;
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

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private chargingService: ChargingService) {
        this.location = navParams.get("location");
        this.chargingTime = 0;
        this.buttonDeactive = false;
        this.mouseDragging = false;
        this.canvasX = 140;
        this.canvasY = 140;
        this.chargingProgress = this.chargingService.getChargingProgress();
    }

    ionViewWillLeave() {
        console.log("leaving the page ");
    }

    ionViewDidLoad() {

        if (this.chargingProgress > 0) {
            let me = this;
            clearInterval(this.myCounter)
            this.myCounter = setInterval(function () {
                me.chargingTimeHours = me.makeTimeString(me.chargingService.getRemainingTime());
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

    startCharging() {
        this.countDown();
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

        if (time > 600) {
            this.buttonDeactive = false;
        }
        else {
            this.buttonDeactive = true;
        }


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
        ctx.font = "35px Arial";
        this.chargingTimeHours = this.chargingTimeHours.substring(0, 5);
        ctx.fillText(this.chargingTimeHours, 95, c.height / 2 + 10);


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

    countDown() {
        if (this.chargingProgress > 0) {
            let alert = this.alertCtrl.create({
                title: 'Stop Charging Confirmation',
                message: 'Are you sure you want to stop?',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            let chargedTime = this.chargingService.chargedTime();
                            this.chargingService.stopCharging();
                            console.log("charged time is", chargedTime);
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
                            Badge.clear();
                            this.navCtrl.push(ChargingCompletePage, {
                                "chargedTime": chargedTimeString
                            });
                        }
                    }
                ]
            });
            alert.present();

        }
        else {
            Badge.set(1);
            this.countingDown = true;
            this.selectedChargingTime = this.chargingTime;
            this.chargingTimeHours = this.chargingTimeHours + ":00";
            let me = this;
            me.timer = (this.hours * 3600) + (this.minutes * 60);
            me.chargingService.startCharging(me.timer);
            me.chargingProgress = me.chargingService.getChargingProgress();
            me.selectedChargingTime = me.timer;
            me.myCounter = setInterval(function () {
                me.hours = Math.floor(me.timer / 3600);
                me.minutes = Math.floor((me.timer % 3600 ) / 60);
                me.seconds = Math.floor((me.timer % 3600) % 60);

                me.hours = me.hours < 10 ? "0" + me.hours : me.hours;
                me.minutes = me.minutes < 10 ? "0" + me.minutes : me.minutes;
                me.seconds = me.seconds < 10 ? "0" + me.seconds : me.seconds;

                me.updateTimerString();
                me.updateCanvas();

                if (--me.timer < 0) {
                    me.timer = 0;
                    clearInterval(me.myCounter);
                    me.countingDown = false;
                    let chargedTimeString = me.makeTimeString(me.chargingService.chargedTime());
                    me.initiateCanvas();
                    Badge.clear();
                    me.navCtrl.push(ChargingCompletePage, {
                        "chargedTime": chargedTimeString
                    });
                }
            }, 1000);
        }
    }

    updateCanvas() {
        let c = <HTMLCanvasElement>document.getElementById('circleProgressBar');
        if (c != null) {
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

            ctx.fillStyle = '#006EF1';
            ctx.lineCap = 'square';
            ctx.beginPath();
            ctx.font = "30px Arial";
            //ctx.fillText(this.chargingTimeHours, 80, c.height / 2 + 10);

            let fullCircle = 2 * Math.PI;
            let progress = ((fullCircle * this.timer) / (8 * 3600)) - (Math.PI / 2);

            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.canvasX, this.canvasY, 97, 1.5 * Math.PI, progress);
            ctx.stroke();
        }
    }
}
