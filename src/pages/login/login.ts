import { Component } from '@angular/core';
import { NavController , ViewController , ModalController} from 'ionic-angular';
import { SignupPage } from '../signup/signup';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController , private viewCtrl: ViewController , public modalCtrl: ModalController) {}

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  signUp(){
    let modalLogin = this.modalCtrl.create(SignupPage);
    modalLogin.present();
    this.viewCtrl.dismiss();
  }

  submitForm(){
    console.log("Login");
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
