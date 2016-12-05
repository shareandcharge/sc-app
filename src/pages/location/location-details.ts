import {Component} from '@angular/core';
import {NavController, NavParams , ViewController , Slides} from 'ionic-angular';
import {CarService} from "../../services/car.service";
import {MapDetailPage} from "./details-map/map";


@Component({
    selector: 'location-details',
    templateUrl: 'location-details.html',
    providers: [CarService]
})
export class LocationDetailPage {
    location: any;
    slideOptions:any;

    constructor(public navCtrl: NavController, private navParams: NavParams , private viewCtrl:ViewController) {

        this.location = navParams.get("location");
        this.slideOptions = {
            initialSlide: 1,
            loop: true
        };

        console.log(this.location);
    }

    ionViewDidLoad() {
    }

/*    itemSelected() {
    }*/

    dismiss(){
        this.viewCtrl.dismiss();
    }

    detailedMap(){
        this.navCtrl.push(MapDetailPage ,{
            "location" : this.location
        });
    }

}
