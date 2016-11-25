import { Component } from '@angular/core';
import { NavController , ViewController , ModalController} from 'ionic-angular';
import { CarManufacturerPage } from '../car-manufacturer/car-manufacturer';



@Component({
  selector: 'page-add-car',
  templateUrl: 'add-car.html'
})
export class AddCarPage {

  constructor(public navCtrl: NavController , private viewCtrl: ViewController , public modalCtrl: ModalController) {}

  ionViewDidLoad() {
  }

  addPhoto(){
    console.log("Add Photo");
  }

  skipAddingCar(){
    console.log(" Skip Add Car");
  }

  selectModdel(){
    console.log("Select Model and Manufacturer");
    let modalManufacturer = this.modalCtrl.create(CarManufacturerPage);
    modalManufacturer.present();
  }

  saveCar(){
    console.log("Save Car");
  }
}
