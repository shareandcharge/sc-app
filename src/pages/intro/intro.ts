import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides, ViewController} from 'ionic-angular';

@Component({
    selector: 'page-on-boarding',
    templateUrl: 'intro.html'
})
export class IntroPage {

    @ViewChild('mySlider') slider: Slides;
    slideOptions: any;
    sliderText: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
        this.sliderText = "Weiter";
        this.slideOptions = {
            initialSlide: 0,
            pager: true
        };

    }

    ionViewDidLoad() {
    }

    SlideChanged() {
        let currentIndex = this.slider.getActiveIndex();
        if (currentIndex == 2) {
            this.sliderText = "Fertig";
        }
        else {
            this.sliderText = "Weiter";
        }
    }

    changeSlide() {
        let currentIndex = this.slider.getActiveIndex();

        if (currentIndex == 2) {
            this.goToHome();
        }

        this.slider.slideNext();
    }

    goToHome() {
        this.viewCtrl.dismiss();
    }

}
