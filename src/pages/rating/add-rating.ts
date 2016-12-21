import {Component} from '@angular/core';
import {NavController, ViewController, AlertController, NavParams} from 'ionic-angular';
import {RatingService} from "../../services/rating.service";
import {Rating} from "../../models/rating";
import {Location} from "../../models/location";
import {AuthService} from "../../services/auth.service";
import {Ionic2Rating} from "ionic2-rating";


@Component({
    selector: 'page-add-rating',
    templateUrl: 'add-rating.html',
    entryComponents : [Ionic2Rating]
})
export class AddRatingPage {
    rating: Rating = new Rating();
    location: Location;

    constructor(public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController, public ratingService: RatingService, public authService: AuthService, public alertCtrl: AlertController) {
        this.location = navParams.get('location');
        this.rating.value = 2.5;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    submitRating() {
        this.rating.createdAt = new Date();
        this.rating.user = this.authService.getUser().id;

        let me = this;

        console.log(this.rating);
        /*
        this.ratingService.createRating(this.location.id, this.rating)
            .subscribe(
                () => {
                    me.viewCtrl.dismiss();
                },
                error => this.displayError(<any>error, 'Rating erstellen'));
        */
    }

    displayError(message: any, subtitle?: string) {
    let alert = this.alertCtrl.create({
        title: 'Fehler',
        subTitle: subtitle,
        message: message,
        buttons: ['Schließen']
    });
    alert.present();
}
}
