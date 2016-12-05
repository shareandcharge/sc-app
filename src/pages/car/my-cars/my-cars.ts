import { Component } from '@angular/core';
import { NavController , NavParams} from 'ionic-angular';
import { AddCarPage } from '../add/add-car';


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
  noCars = false;
  constructor(public navCtrl: NavController , private navParams : NavParams) {

    console.log("The car is " , this.cars)
    if(typeof navParams.get("cars") != 'undefined'){
      this.cars = navParams.get("cars");
    }
    else{
      this.noCars = true;
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
    if(this.noCars){
      this.navCtrl.setRoot(AddCarPage, {
        "mode" : "add"
      });
    }
    else{
      this.navCtrl.setRoot(AddCarPage, {
        "cars" : this.cars,
        "mode" : "add"
      });
    }

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
