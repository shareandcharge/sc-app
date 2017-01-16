import {Component} from '@angular/core';
import {
    NavController,
    ViewController,
    ModalController,
    NavParams,
    LoadingController,
    AlertController
} from 'ionic-angular';
import {SignupPage} from '../signup/signup';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, Validators} from '@angular/forms';
import {emailValidator} from '../../validators/emailValidator';


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
    errorMessages: any;
    loginForm: any;
    submitAttempt: boolean = false;

    constructor(public navCtrl: NavController, public formBuilder: FormBuilder, private alertCtrl: AlertController, private navParams: NavParams, private viewCtrl: ViewController, public modalCtrl: ModalController, private userService: UserService, public auth: AuthService, private loadingCtrl: LoadingController) {
        this.destination = navParams.get("dest");
        this.mode = navParams.get('mode') || 'page';

        this.createErrorMessages();

        this.loginForm = formBuilder.group({
            email: ['', Validators.compose([emailValidator.isValid, Validators.maxLength(225)])],
            password: ['', Validators.compose([Validators.maxLength(225), Validators.minLength(7), Validators.required])]
        });
    }

    createErrorMessages() {
        this.errorMessages = {
            "email": 'Bitte gib Deine E-Mail Adresse an.',
            "password": 'Bitte gib ein Passwort an.'
        }
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
        this.submitAttempt = true;
        if (this.loginForm.valid) {
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

    }

    logout() {
        this.auth.logout();
    }

    showHelp(field) {
        let message = "";

        switch (field) {
            case 'password':
                message = "min 7 digits";
                break;
        }

        if (message != "") {
            let alert = this.alertCtrl.create({
                title: 'Info',
                message: message,
                buttons: ['Ok']
            });
            alert.present();
        }
    }
}
