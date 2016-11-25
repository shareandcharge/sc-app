import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

/*
 Generated class for the CarManufacturer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-car-manufacturer',
    templateUrl: 'car-manufacturer.html'
})
export class CarManufacturerPage {

    constructor(public navCtrl:NavController, private viewCtrl:ViewController) {
        
    }

    ionViewDidLoad() {
        console.log('Hello CarManufacturerPage Page');
    }

    dismiss(data) {
        this.viewCtrl.dismiss(data);
    }

}
