import {Component} from '@angular/core';
import {NavController, ViewController, ModalController, LoadingController, AlertController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {TermsPage} from "./terms";
import {FormBuilder, Validators} from '@angular/forms';
import {termsValidator} from '../../validators/termsValidator';
import {emailValidator} from '../../validators/emailValidator';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {

    signUpObject = {"email": "", "authentification": {"type": "passwd", "password": ""}};
    termsAccept: boolean;
    errorMessages: any;
    signUpForm: any;
    submitAttempt: boolean = false;
    error: string;

    constructor(public navCtrl: NavController, public formBuilder: FormBuilder, private alertCtrl: AlertController, private viewCtrl: ViewController, public modalCtrl: ModalController, public auth: AuthService, public userService: UserService, public loadingCtrl: LoadingController) {
        this.createErrorMessages();
        this.signUpForm = formBuilder.group({
            email: ['', Validators.compose([emailValidator.isValid, Validators.maxLength(225)])],
            password: ['', Validators.compose([Validators.maxLength(225), Validators.minLength(7), Validators.required])],
            terms: [false, Validators.compose([termsValidator.isValid, Validators.required])]
        });
    }

    createErrorMessages() {
        this.errorMessages = {
            "email": 'Bitte gib Deine E-Mail Adresse an.',
            "password": 'Bitte gib ein Passwort an.',
            "terms": 'Du musst den AGBs zustimmen.'
        }
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
        this.submitAttempt = true;

        /*this.error = '';
         if ('' === this.signUpObject.email || '' === this.signUpObject.authentification.password) {
         this.error = 'Bitte gib Deine E-Mail Adresse und ein Passwort an.';
         return false;
         }
         if (!this.termsAccept) {
         this.error = "Du musst den AGBs zustimmen.";
         return false;
         }*/

        if (this.signUpForm.valid) {
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
