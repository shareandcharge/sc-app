import { Component } from '@angular/core';
import { NavController , NavParams} from 'ionic-angular';
import { AddCarPage } from '../add-car/add-car';


/*
  Generated class for the MyCars page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-cars',
  templateUrl: 'my-cars.html'
})
export class MyCarsPage {
  cars = [];
  newCar : any;
  mode: any;
  constructor(public navCtrl: NavController , private navParams : NavParams) {
    if(typeof navParams.get("cars") != 'undefined'){
      this.cars = navParams.get("cars");
    }
    this.newCar = navParams.get("newCar");
    this.mode = navParams.get("mode");
    if(this.mode != "edit"){
      this.cars.push(this.newCar);
    }
  }

  ionViewDidLoad() {
  }

  addCar(){
    this.navCtrl.setRoot(AddCarPage, {
      "cars" : this.cars,
      "mode" : "add"
    });
  }

  editCar(carPlateNum){
    console.log(carPlateNum);

    var index =  this.cars.findIndex(c => c.plateNumber === carPlateNum);

    this.navCtrl.push(AddCarPage, {
      "cars" : this.cars,
      "car" : this.cars[index],
      "mode": "edit"
    });
  }
}
