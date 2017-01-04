import {Component} from '@angular/core';
import {NavController, ViewController, ModalController, LoadingController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";


@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {

    signUpObject = {"email": "", "authentification": {"type": "passwd", "password": ""}};
    termsAccept: boolean;

    error: string;

    constructor(public navCtrl: NavController, private viewCtrl: ViewController, public modalCtrl: ModalController, public auth: AuthService, public userService: UserService, public loadingCtrl: LoadingController) {
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
        this.error = '';
        if (!this.termsAccept) {
            this.error = "Du musst den AGBs zustimmen.";
            return false;
        }

        let loader = this.loadingCtrl.create({
            content: "Melde an ...",
        });
        loader.present();

        this.userService.createUser(this.signUpObject).subscribe(
            (success) => {
                loader.dismissAll();
                this.viewCtrl.dismiss();
            },
            (error) => {
                loader.dismissAll();
                this.error = error;
            }
        );
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

}
