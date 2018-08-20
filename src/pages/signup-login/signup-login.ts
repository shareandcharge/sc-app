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
// import {LanguageService} from "../../services/language.service";
import {TrackerService} from "../../services/tracker.service";
import {User} from "../../models/user";
import {ConfigService} from "../../services/config.service";
import {InAppBrowser} from "ionic-native";
import {Storage} from '@ionic/storage';
import {DataProtectionPage} from "../_global/data-protection/data-protection";
import {TranslateService} from "@ngx-translate/core";
import {IntroPage} from '../../pages/intro/intro';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup-login.html'
})
export class SignupLoginPage {

    signUpLoginObject = {
        "firstName": "",
        "lastName": "",
        "street": "",
        "zipcode": "",
        "city": "",
        "email": "",
        "phone": "",
        "profile": { "newsletter": false, "language": "", "disableTracking": false },   // should disableTracking be hardcoded???
        "authentification": { "type": "passwd", "password": "" }
    };

    termsAccept: boolean;
    errorMessages: any;
    signUpLoginForm: any;
    submitAttempt: boolean = false;
    error: string;
    action: string;
    destination: string;
    mode: string;
    buttonText = {
        'signUp': this.translateService.instant('login.register'),
        'login': this.translateService.instant('login.login')
    };

    constructor(public navCtrl: NavController, public formBuilder: FormBuilder, private alertCtrl: AlertController,
                private viewCtrl: ViewController, public modalCtrl: ModalController, public auth: AuthService,
                public userService: UserService, public loadingCtrl: LoadingController, private navParams: NavParams,
                private errorService: ErrorService, private trackerService: TrackerService, public storage: Storage,
                private configService: ConfigService, private translateService: TranslateService) {
        this.action = this.navParams.get('action');

        // if(typeof this.action === 'undefined') {
            this.action = 'login';
        // }
        this.createErrorMessages();
        this.signUpLoginForm = formBuilder.group({
            firstname: [''],
            lastname: [''],
            street: [''],
            zipcode: [''],
            city: [''],
            phone: [''],
            email: ['', Validators.compose([emailValidator.isValid, Validators.maxLength(225)])],
            password: ['', Validators.compose([Validators.maxLength(225), Validators.required])]
        });

        if (this.action === 'signUp') {
            this.signUpLoginForm.addControl(
                "terms", new FormControl(false, Validators.compose([termsValidator.isValid, Validators.required]))
            );
            this.signUpLoginForm.addControl(
                "newsletter", new FormControl(false)
            );
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
            "email": this.translateService.instant('login.email_remind'),
            "password": this.translateService.instant('login.password_complexity'),
            "terms": this.translateService.instant('login.agb_agree')
        }
    }

    switchTabs() {
        this.submitAttempt = false;

        if (this.action === 'login') {
            this.signUpLoginForm.removeControl('terms');
            this.signUpLoginForm.removeControl('newsletter');
        }

        if (this.action === 'signUp') {
            this.signUpLoginForm.addControl(
                "terms", new FormControl(false, Validators.compose([termsValidator.isValid, Validators.required]))
            );
            this.signUpLoginForm.addControl(
                "newsletter", new FormControl(false)
            );
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
        let url = this.translateService.instant('documents.TERMS_APP_URL');
        let close = this.translateService.instant('common.close');
        new InAppBrowser(url, '_blank', 'presentationstyle=fullscreen,closebuttoncaption= '+close+',toolbar=yes,location=no');
    }

    openDataProtection() {
        let modal = this.modalCtrl.create(DataProtectionPage);
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

    intro() {
        let modal = this.modalCtrl.create(IntroPage);
        modal.present();
    }

    login() {
        this.submitAttempt = true;

        if (this.signUpLoginForm.valid) {
            let loader = this.loadingCtrl.create({
                content: this.translateService.instant('login.login') + "...",
            });
            loader.present();

            this.trackerService.track('Login Info Added', {
                'Screen Name': 'Login',
                'Login': 'yes',
                'Signup': 'no',
                'Sign up method': 'Email',
                'Timestamp': '',
                'Terms accepted': 'yes'
            });

            this.userService.login(this.signUpLoginObject.email, this.signUpLoginObject.authentification.password).subscribe(
                () => {
                    this.trackerService.track('Login Completed', {
                        'Screen Name': 'Login',
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
                    this.errorService.displayErrorWithKey(error, this.translateService.instant('login.login'));
                    loader.dismissAll();
                });
        }

    }

    signUp() {
        this.submitAttempt = true;

        if (!this.signUpLoginForm.valid) {
            return;
        }


        this.signUpLoginObject.profile.language = this.translateService.currentLang;

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

                let loader = this.loadingCtrl.create({
                    content: "Registration successfull! \n logging in..."
                });
                loader.present();

                setTimeout(() => {
                    loader.dismiss();
                  }, 1500);
                this.viewCtrl.dismiss();
            },
            (error) => {
                // loader.dismissAll();
                this.errorService.displayErrorWithKey(error, this.translateService.instant('login.registration'))
            }
        );

    }

    showHelp(field) {
        let message = "";

        switch (field) {
            case 'password':
                message = this.translateService.instant('login.password_7_chars');
                break;
        }

        if (message != "") {
            let alert = this.alertCtrl.create({
                title: this.translateService.instant('common.info'),
                message: message,
                buttons: [this.translateService.instant('common.ok')]
            });
            alert.present();
        }
    }
}
