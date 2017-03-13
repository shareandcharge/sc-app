import {Component, ViewChild} from '@angular/core';
import {Slides, ViewController, NavParams} from 'ionic-angular';
import {TrackerService} from "../../services/tracker.service";

@Component({
    selector: 'page-on-boarding',
    templateUrl: 'intro.html'
})
export class IntroPage {

    @ViewChild('mySlider') slider: Slides;
    slideOptions: any;
    isEnd: boolean = false;
    isOnboarding: boolean = false;

    constructor(private viewCtrl: ViewController, private trackerService: TrackerService, private navParams: NavParams) {
        this.isOnboarding = navParams.get('isOnboarding');
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
            if (this.isOnboarding) {
                this.trackerService.track('Onboarding Completed', {
                    'Screen Name': 'Screen #' + (this.slider.getActiveIndex() + 1),
                    'Timestamp': ''
                });
            }
            this.close();
        }
        else {
            this.slider.slideNext();
        }
    }

    close() {
        this.viewCtrl.dismiss();
    }

    skip() {
        if (this.isOnboarding) {
            this.trackerService.track('Onboarding Skipped', {
                'Screen Name': 'Screen #' + (this.slider.getActiveIndex() + 1),
                'Timestamp': ''
            });
        }
        this.close();
    }
}