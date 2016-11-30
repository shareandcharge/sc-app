import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { MapPage } from '../map/map';
import { AboutPage } from '../about/about';
import { AddCarPage } from '../add-car/add-car';
import { SignupPage } from '../signup/signup';
import { AddStationPage } from '../station/add/add-station';
import { MyCarsPage } from '../my-cars/my-cars';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = MapPage;
  tab2Root: any = AddCarPage;
  tab3Root: any = SignupPage;
  tab4Root: any = AboutPage;

  constructor(public modalCtrl: ModalController) {

  }

  signUpModal(){
    let modal = this.modalCtrl.create(SignupPage);
    modal.present();

  }

  addCarModal(){
    let modal = this.modalCtrl.create(AddCarPage);
    modal.present();

  }

  addStationModal(){
    let modal = this.modalCtrl.create(AddStationPage);
    modal.present();
  }

  myCarsModal(){
    let modal = this.modalCtrl.create(MyCarsPage);
    modal.present();
  }
}
