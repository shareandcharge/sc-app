import { Component } from '@angular/core';
import { NavController , ViewController , ModalController} from 'ionic-angular';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  constructor(public navCtrl: NavController , private viewCtrl: ViewController , public modalCtrl: ModalController) {}

  ionViewDidLoad() {
    //console.log('Hello SignupPage Page');
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
  
  login(data) {
    let modalLogin = this.modalCtrl.create(LoginPage);
    modalLogin.present();
    this.viewCtrl.dismiss(data);
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
