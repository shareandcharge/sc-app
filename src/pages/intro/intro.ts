import {Component, ViewChild} from '@angular/core';
import {Slides, ViewController} from 'ionic-angular';

@Component({
    selector: 'page-on-boarding',
    templateUrl: 'intro.html'
})
export class IntroPage {

    @ViewChild('mySlider') slider: Slides;
    slideOptions: any;
    isEnd: boolean = false;

    constructor(private viewCtrl: ViewController) {
        this.slideOptions = {
            initialSlide: 0,
            pager: true
        };
    }

    slideChanged() {
        this.isEnd = this.slider.isEnd();
    }

    goToNext() {
        this.isEnd = this.slider.isEnd();

        if (this.isEnd) {
            this.goToEnd();
        }
        else {
            this.slider.slideNext();
        }
    }

    goToEnd() {
        this.viewCtrl.dismiss();
    }
}