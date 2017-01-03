import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';

@Component({
    selector: 'page-on-boarding',
    templateUrl: 'intro.html'
})
export class IntroPage {

    @ViewChild('mySlider') slider: Slides;
    slideOptions: any;
    sliderText: any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.sliderText = "Weiter";
        this.slideOptions = {
            initialSlide: 0,
            pager: true
        };

    }

    ionViewDidLoad() {
        console.log("slider is ", this.slider);
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
        this.navCtrl.setRoot(TabsPage);
    }

}
