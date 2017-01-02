import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ProfilePage} from '../../profile/profile'

@Component({
  selector: 'page-account-settings',
  templateUrl: 'account-settings.html'
})
export class AccountSettingsPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello AccountSettingsPage Page');
  }


  notifs(){

  }
  deleteAccount(){

  }

  profile(){
    this.navCtrl.push(ProfilePage);
  }

  privacy(){

  }

  lang(){

  }
}
