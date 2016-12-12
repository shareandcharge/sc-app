import {Component} from '@angular/core';
import {NavController, ViewController, ModalController , NavParams} from 'ionic-angular';
import {SignupPage} from '../signup/signup';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {MyCarsPage} from "../car/my-cars/my-cars";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    providers: [UserService]
})
export class LoginPage {

    credentials = {"email": "", "password": ""};
    destination: any;


    constructor(public navCtrl: NavController, private navParams : NavParams,private viewCtrl: ViewController, public modalCtrl: ModalController, private userService: UserService, public auth: AuthService) {
        this.destination = navParams.get("dest");
    }

    ionViewDidLoad() {
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    signUp() {
        let modalLogin = this.modalCtrl.create(SignupPage);
        modalLogin.present();
        this.viewCtrl.dismiss();
    }

    submitForm() {
        this.userService.login(this.credentials.email, this.credentials.password);

        this.viewCtrl.dismiss();

        if(typeof this.destination != 'undefined'){
            console.log(this.destination);
            this.navCtrl.push(this.destination);
        }
    }

    loginFacebook() {
        console.log("Login Facebook");
    }

    loginGoogle() {
        console.log("Login Google");
    }

    loginMicrosoft() {
        console.log("Login Microsoft");
    }

    logout() {
        this.auth.logout();
    }
}
