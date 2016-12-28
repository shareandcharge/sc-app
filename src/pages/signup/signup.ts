import { Component } from '@angular/core';
import {NavController, ViewController, ModalController, LoadingController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  signUpObject = {"email": "", "authentification": {"type" : "password", "password": ""}};

  constructor(public navCtrl: NavController , private viewCtrl: ViewController , public modalCtrl: ModalController, public auth: AuthService, public userService: UserService, public loadingCtrl: LoadingController) {}

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

  signUp() {
    let loader = this.loadingCtrl.create({
      content: "Signing up ...",
    });
    loader.present();

    this.userService.createUser(this.signUpObject).subscribe(res => {
      loader.dismissAll();
      this.viewCtrl.dismiss();
    });
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
