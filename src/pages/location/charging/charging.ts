import {Component} from '@angular/core';
import {NavController, NavParams ,AlertController} from 'ionic-angular';
import {ChargingCompletePage} from './charging-complete/charging-complete'

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
    buttonText: any;
    countingDown: boolean;
    myCounter: any;
    buttonDeactive:any;
    selectedChargingTime:any;

    constructor(public navCtrl: NavController, public navParams: NavParams , private alertCtrl : AlertController) {
        this.location = navParams.get("location");
        this.chargingTime = 0;
        this.countingDown = false;
        this.buttonDeactive = true;
        console.log(this.location);
    }

    ionViewDidLoad() {
    }

    startCharging() {
        console.log(this.chargingTime);
        this.countDown();
    }

    updateTimerString() {
        let timerString = this.hours + ':' + this.minutes + ':' + this.seconds;
        this.chargingTimeHours = timerString;
    }

    convertToHours() {
        const minuteStep = 4;
        this.seconds = 0;
        this.hours = Math.floor(this.chargingTime / minuteStep);
        this.minutes = (this.chargingTime % minuteStep) * (60 / minuteStep);

        this.hours = this.hours < 10 ? "0" + this.hours : this.hours;
        this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
        this.minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes;

        this.updateTimerString();
        console.log(this.chargingTime);
        if(this.chargingTime > 0){
            this.buttonDeactive = null;
        }
        else{
            this.buttonDeactive = true;
        }


        var c = <HTMLCanvasElement>document.getElementById('circleProgressBar');
        let ctx: CanvasRenderingContext2D = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.strokeStyle = 'blue';
        ctx.lineCap = 'square';
        ctx.beginPath();
        ctx.font = "20px Arial";
        ctx.fillText(this.chargingTimeHours ,65, c.height/2);
        let fullCircle = 2*Math.PI;
        let progress = ((fullCircle * this.chargingTime) / 32) - (Math.PI / 2);
        if(this.chargingTime == 32) {
            progress = 3.5 * Math.PI;
        }
        if(this.chargingTime == 0) {
            progress = 1.5*Math.PI;
        }
        console.log("progress is" , progress);
        ctx.arc(101,101,100,1.5*Math.PI,progress);
        ctx.stroke();

    }


    makeTimeString(data){
        let hours = Math.floor(data / 3600);
        let minutes =  Math.floor((data % 3600 ) / 60);
        let seconds = Math.floor((data % 3600 ) % 60);

        let h = hours < 10 ? "0" + hours : hours;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;


        let finalString = h + ':' + m + ':' + s ;
        return finalString;
    }

    countDown() {
        if (this.countingDown) {

            let alert = this.alertCtrl.create({
                title: 'Stop Charging Confirmation',
                message: 'Are you sure you want to stop?',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            let chargedTime = this.selectedChargingTime - this.timer;
                            let chargedTimeString = this.makeTimeString(chargedTime);
                            this.countingDown = false;
                            clearInterval(this.myCounter);
                            this.chargingTime = 0;
                            this.convertToHours();
                            this.navCtrl.push(ChargingCompletePage , {
                                "chargedTime" : chargedTimeString
                            });
                        }
                    }
                ]
            });
            alert.present();

        }
        else {
            this.countingDown = true;
            this.selectedChargingTime = this.chargingTime;
            let me = this;
            me.timer = (this.hours * 3600) + (this.minutes * 60);
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
                console.log(me.chargingTimeHours);
                if (--me.timer < 0) {
                    me.timer = 0;
                    clearInterval(me.myCounter);
                    me.countingDown = false;
                    let chargedTimeString = me.makeTimeString(me.selectedChargingTime);

                    me.navCtrl.push(ChargingCompletePage , {
                        "chargedTime" : chargedTimeString
                    });
                }
            }, 1000);
        }

    }

    updateCanvas(){
        var c = <HTMLCanvasElement>document.getElementById('circleProgressBar');
        let ctx: CanvasRenderingContext2D = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.strokeStyle = 'blue';
        ctx.lineCap = 'square';
        ctx.beginPath();
        ctx.font = "20px Arial";
        ctx.fillText(this.chargingTimeHours ,65, c.height/2);
        let fullCircle = 2*Math.PI;
        let progress = ((fullCircle * this.timer) / (8 * 3600)) - (Math.PI / 2);
        if(this.chargingTime == 32) {
            progress = 3.5 * Math.PI;
        }
        if(this.chargingTime == 0) {
            progress = 1.5*Math.PI;
        }
        console.log("progress is" , progress);
        ctx.arc(101,101,100,1.5*Math.PI,progress);
        ctx.stroke();
    }
}
