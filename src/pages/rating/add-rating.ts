import {Component} from '@angular/core';
import {NavController, ViewController, AlertController, NavParams} from 'ionic-angular';
import {RatingService} from "../../services/rating.service";
import {Rating} from "../../models/rating";
import {Location} from "../../models/location";
import {AuthService} from "../../services/auth.service";
import {ErrorService} from "../../services/error.service";
import {LocationService} from "../../services/location.service";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'page-add-rating',
    templateUrl: 'add-rating.html'
})
export class AddRatingPage {
    rating: Rating = new Rating();
    location: Location;
    locationImages: Array<any>;

    constructor(public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController,
                public ratingService: RatingService, public authService: AuthService, public alertCtrl: AlertController,
                private errorService: ErrorService, private locationService: LocationService, private translateService: TranslateService) {
        this.location = navParams.get('location');
        this.locationImages = locationService.getImagesWithSrc(this.location);
        this.rating.rating = 5;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    submitRating() {
        this.rating.createdAt = new Date();
        this.rating.user = this.authService.getUser().id;

        this.ratingService.createRating(this.location.id, this.rating)
            .subscribe(
                () => this.ratingSubmitted(),
                (error) => this.errorService.displayErrorWithKey(error, 'error.scope.create_rating'));
    }

    ratingSubmitted() {
        let alert = this.alertCtrl.create({
                title: this.translateService.instant('rating.save_rating'),
                message: this.translateService.instant('rating.thank_rating'),
                buttons: [
                    {
                        text: this.translateService.instant('common.close'),
                        role: 'cancel',
                        handler: () => this.viewCtrl.dismiss()
                    }
                ]

            })
        ;
        alert.present();
    }
}
