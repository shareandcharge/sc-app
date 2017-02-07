import {Component} from '@angular/core';
import {
    NavController, ViewController, ModalController, LoadingController, AlertController,
    NavParams
} from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {TermsPage} from "./terms";
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {termsValidator} from '../../validators/termsValidator';
import {emailValidator} from '../../validators/emailValidator';
import {ErrorService} from "../../services/error.service";
import {ForgotPasswordPage} from "./forgot-password/forgot-password";

@Component({
    selector: 'page-signup',
    templateUrl: 'signup-login.html'
})
export class SignupLoginPage {

    signUpLoginObject = {"email": "", "authentification": {"type": "passwd", "password": ""}};
    termsAccept: boolean;
    errorMessages: any;
    signUpLoginForm: any;
    submitAttempt: boolean = false;
    error: string;
    action: string;
    destination: string;
    mode: string;
    buttonText = {
        'signUp' : 'Anmelden',
        'login' : 'Login'
    };

    constructor(public navCtrl: NavController, public formBuilder: FormBuilder, private alertCtrl: AlertController, private viewCtrl: ViewController, public modalCtrl: ModalController, public auth: AuthService, public userService: UserService, public loadingCtrl: LoadingController, private navParams: NavParams, private errorService: ErrorService) {
        this.action = this.navParams.get('action');
        if (typeof this.action === 'undefined') {
            this.action = 'login';
        }

        this.createErrorMessages();
        this.signUpLoginForm = formBuilder.group({
            email: ['', Validators.compose([emailValidator.isValid, Validators.maxLength(225)])],
            password: ['', Validators.compose([Validators.maxLength(225), Validators.minLength(7), Validators.required])]
        });

        if (this.action === 'signUp') {
            this.signUpLoginForm.addControl(
                "terms", new FormControl(false, Validators.compose([termsValidator.isValid, Validators.required]))
            )
        }

        this.destination = this.navParams.get('dest');
        this.mode = this.navParams.get('mode');
    }

    createErrorMessages() {
        this.errorMessages = {
            "email": 'Bitte gib Deine E-Mail Adresse an.',
            "password": 'Bitte gib ein Passwort an.',
            "terms": 'Du musst den AGBs zustimmen.'
        }
    }

    switchTabs() {
        this.submitAttempt = false;

        if (this.action === 'login') {
            this.signUpLoginForm.removeControl('terms');
        }

        if (this.action === 'signUp') {
            this.signUpLoginForm.addControl(
                "terms", new FormControl(false, Validators.compose([termsValidator.isValid, Validators.required]))
            )
        }
    }

    forgotPassword() {
        let modal = this.modalCtrl.create(ForgotPasswordPage);
        modal.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    openTerms() {
        let modal = this.modalCtrl.create(TermsPage);
        modal.present();
    }

    submitForm() {
        if (this.action === 'login') {
            this.login();
        }

        if (this.action === 'signUp') {
            this.signUp();
        }
    }

    login() {
        this.submitAttempt = true;

        if (this.signUpLoginForm.valid) {
            let loader = this.loadingCtrl.create({
                content: "Login ...",
            });
            loader.present();

            this.userService.login(this.signUpLoginObject.email, this.signUpLoginObject.authentification.password).subscribe(
                () => {
                    loader.dismissAll();
                    this.viewCtrl.dismiss();

                    if (typeof this.destination !== 'undefined') {
                        if (this.mode === 'page') {
                            this.navCtrl.push(this.destination);
                        } else if (this.mode === 'modal') {
                            let modal = this.modalCtrl.create(this.destination);
                            modal.present();
                        }
                    }
                },
                (error) => {
                    this.errorService.displayErrorWithKey(error, 'Login');
                    loader.dismissAll();
                });
        }

    }

    signUp() {
        this.submitAttempt = true;

        if (this.signUpLoginForm.valid) {
            let loader = this.loadingCtrl.create({
                content: "Melde an ...",
            });
            loader.present();

            this.userService.createUser(this.signUpLoginObject).subscribe(
                () => {
                    loader.dismissAll();
                    this.viewCtrl.dismiss();
                },
                (error) => {
                    loader.dismissAll();
                    this.errorService.displayErrorWithKey(error, 'Registrierung')
                }
            );
        }
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
