import {Component} from '@angular/core';
import {
    NavController, ViewController, ModalController, LoadingController, AlertController,
    NavParams
} from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {termsValidator} from '../../validators/termsValidator';
import {emailValidator} from '../../validators/emailValidator';
import {ErrorService} from "../../services/error.service";
import {ForgotPasswordPage} from "./forgot-password/forgot-password";
import {TrackerService} from "../../services/tracker.service";
import {User} from "../../models/user";
import {ConfigService} from "../../services/config.service";
import {InAppBrowser} from "ionic-native";

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
        'signUp' : 'Registrieren',
        'login' : 'Anmelden'
    };

    constructor(public navCtrl: NavController, public formBuilder: FormBuilder, private alertCtrl: AlertController,
                private viewCtrl: ViewController, public modalCtrl: ModalController, public auth: AuthService,
                public userService: UserService, public loadingCtrl: LoadingController, private navParams: NavParams,
                private errorService: ErrorService, private trackerService: TrackerService, private configService: ConfigService) {
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

    ionViewWillEnter() {
        this.trackerService.track('Started Sign Up', {
            'Screen Name': this.navParams.get('trackReferrer') ? this.navParams.get('trackReferrer') : 'Signup/Login',
            'Login': 'yes',
            'Signup': 'yes'
        });
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
        let url = this.configService.get('TERMS_APP_URL');
        new InAppBrowser(url, '_blank', 'presentationstyle=fullscreen,closebuttoncaption=Schließen,toolbar=yes,location=no');
    }

    openDataProtection() {
        let url = this.configService.get('DATA_PROTECTION_URL');
        new InAppBrowser(url, '_blank', 'presentationstyle=fullscreen,closebuttoncaption=Schließen,toolbar=yes,location=no');
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
                content: "Anmelden ...",
            });
            loader.present();

            this.userService.login(this.signUpLoginObject.email, this.signUpLoginObject.authentification.password).subscribe(
                () => {
                    this.trackerService.track('Login Completed', {
                        'Screen Name': 'Registrieren',
                        'Login': 'yes',
                        'Signup': 'no',
                        'Sign up method': 'Email',
                        'Timestamp': '',
                        'Terms accepted': 'yes'
                    });
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
                    this.errorService.displayErrorWithKey(error, 'Anmelden');
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

            this.trackerService.track('Signup Info Added', {
                'Screen Name': 'Registrieren',
                'Sign up method': 'Email',
                'Timestamp': '',
                'Terms accepted': 'yes'
            });

            this.userService.createUser(this.signUpLoginObject).subscribe(
                (user: User) => {
                    this.trackerService.track('Completed Sign Up', {
                        'Screen Name': 'Registrieren',
                        'Sign up method': 'Email',
                        'Timestamp': '',
                        'Terms accepted': 'yes',
                        'Login': 'no',
                        'Signup': 'yes'
                    });

                    this.trackerService.alias(user);

                    //-- calling alias may take up to 2 seconds (according to their docs)
                    setTimeout(() => {
                        this.trackerService.userSet({
                            'Sign up method': 'Email',
                            'Terms accepted': 'yes',
                        })
                    }, 2500);

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
                message = "Mindestens 7 Zeichen.";
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
