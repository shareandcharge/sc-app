import {Component} from '@angular/core';
import {NavController, ViewController, ModalController, NavParams, LoadingController} from 'ionic-angular';
import {SignupPage} from '../signup/signup';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    providers: []
})
export class LoginPage {

    credentials = {"email": "", "password": ""};
    destination: any;
    mode: any;
    error: string;

    constructor(public navCtrl: NavController, private navParams: NavParams, private viewCtrl: ViewController, public modalCtrl: ModalController, private userService: UserService, public auth: AuthService, private loadingCtrl: LoadingController) {
        this.destination = navParams.get("dest");
        this.mode = navParams.get('mode') || 'page';
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
        this.error = '';

        if ('' === this.credentials.email || '' === this.credentials.password) {
            this.error = 'Bitte gib Deine E-Mail Adresse und Dein Passwort ein.';
            return false;
        }

        let loader = this.loadingCtrl.create({
            content: "Login ...",
        });
        loader.present();

        this.userService.login(this.credentials.email, this.credentials.password).subscribe(
            () => {
                loader.dismissAll();
                this.viewCtrl.dismiss();

                if (typeof this.destination != 'undefined') {
                    console.log(this.destination);

                    if (this.mode === 'page') {
                        this.navCtrl.push(this.destination);
                    } else if (this.mode === 'modal') {
                        let modal = this.modalCtrl.create(this.destination);
                        modal.present();
                    }
                }
            },
            (error) => {
                this.error = error;
                loader.dismissAll();
            });
    }

    logout() {
        this.auth.logout();
    }
}
