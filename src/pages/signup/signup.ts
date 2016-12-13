import { Component } from '@angular/core';
import { NavController , ViewController , ModalController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  credentials = {"email": "", "password": ""};

  constructor(public navCtrl: NavController , private viewCtrl: ViewController , public modalCtrl: ModalController, public auth: AuthService) {}

  ionViewDidLoad() {
    //console.log('Hello SignupPage Page');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  login() {
    let modalLogin = this.modalCtrl.create(LoginPage);
    modalLogin.present();
    this.viewCtrl.dismiss();
  }

  logForm(){
    console.log("Signup");
  }

  loginFacebook(){
    console.log("Login Facebook");
  }

  loginGoogle(){
    console.log("Login Google");
  }

  loginMicrosoft(){
    console.log("Login Microsoft");
  }

}
