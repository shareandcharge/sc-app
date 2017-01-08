import {Component} from '@angular/core';
import {NavController, ViewController, ModalController, LoadingController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {TermsPage} from "./terms";


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

    openTerms() {
        let modal = this.modalCtrl.create(TermsPage);
        modal.present();
    }

    signUp() {
        this.error = '';

        if ('' === this.signUpObject.email || '' === this.signUpObject.authentification.password) {
            this.error = 'Bitte gib Deine E-Mail Adresse und ein Passwort an.';
            return false;
        }

        if (!this.termsAccept) {
            this.error = "Du musst den AGBs zustimmen.";
            return false;
        }

        let loader = this.loadingCtrl.create({
            content: "Melde an ...",
        });
        loader.present();

        this.userService.createUser(this.signUpObject).subscribe(
            () => {
                loader.dismissAll();
                this.viewCtrl.dismiss();
            },
            (error) => {
                loader.dismissAll();
                this.error = error;
            }
        );
    }
}
