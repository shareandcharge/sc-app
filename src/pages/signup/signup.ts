import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    //console.log('Hello SignupPage Page');
  }

  signUp(){
    console.log("Signup");
  }

  login(){
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
