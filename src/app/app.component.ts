import {Component, ViewChild} from '@angular/core';
import {
    Platform, Events, LoadingController, Config, ModalController, App, IonicApp,
    MenuController, AlertController, ToastController, Nav
} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {Storage} from '@ionic/storage';

import {TabsPage} from '../pages/tabs/tabs';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {ChargingService} from "../services/charging.service";
import {IntroPage} from '../pages/intro/intro';
import {TranslateService} from "@ngx-translate/core";
import {PushNotificationService} from "../services/push.notification.service";
import {ErrorService} from "../services/error.service";
import {TrackerService} from "../services/tracker.service";
import {ChargingCompletePage} from "../pages/location/charging/charging-complete/charging-complete";
import {User} from "../models/user";
import {CurrencyService} from "../services/currency.service";
import {LanguageService} from "../services/language.service";
import { SignupLoginPage } from "../pages/signup-login/signup-login";

@Component({
    template: `
        <ion-nav [root]="rootPage"></ion-nav>`,
    providers: [CurrencyService]
})
export class MyApp {
    /* Go to root page once the platform is ready */
    rootPage: any = null;

    @ViewChild(Nav) nav: Nav;

    constructor(private app: App, private platform: Platform, private modalCtrl: ModalController,
                private authService: AuthService, private userService: UserService,
                private chargingService: ChargingService, private events: Events, public loadingCtrl: LoadingController,
                public storage: Storage, private translateService: TranslateService, private config: Config,
                private pushNotificationService: PushNotificationService, private errorService: ErrorService,
                private ionicApp: IonicApp, private menuCtrl: MenuController, private alertCtrl: AlertController,
                private trackerService: TrackerService, private toastCtrl: ToastController,
                private languageService: LanguageService) {


        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.

            this.languageService.initLanguage();

            trackerService.init();

            platform.resume.subscribe(() => {
                this.checkChargingProgress();
                this.events.publish('locations:updated');
            });

            config.set('scrollAssist', true);

            StatusBar.styleDefault();
            Splashscreen.hide();

            //-- deactivated for now as we don't sent any push notifs, yet (#150037805)
            //this.pushNotificationService.initPushNotification();

            this.events.subscribe('auth:refresh:user', (checkChargingProcess?) => {
                this.refreshUser(checkChargingProcess);
            });

            this.events.subscribe('user:refreshed', () => {
                this.updateUserDeviceToken();
            });

            this.events.subscribe('auth:login', () => {
                this.updateUserDeviceToken();
                this.checkChargingProgress();
                this.checkTrackingOnLogin();
                this.languageService.setLanguageFromUser();
            });

            this.events.subscribe('auth:logout', () => {
                this.checkChargingProgress();
            });

            this.events.subscribe('charging:lapsed', () => {
                this.chargingLapsed();
                this.events.publish('locations:updated');
            });

            this.checkExistingToken();

            //-- Handle hardware back button for Android and Windows Phone (don't close the app on all backs)
            platform.registerBackButtonAction(() => this.handleBackButton(), 1);

            this.storage.get('introShown').then((result) => {
                if (!result) {
                    this.storage.set('introShown', true);
                    let introModal = this.modalCtrl.create(IntroPage, {isOnboarding: true});
                    introModal.onDidDismiss(() => this.goRoot());
                    introModal.present();
                }
                else {
                    let loggedIn = authService.loggedIn();
                    if(loggedIn === true){
                        this.goRoot();
                    }else {
                        this.goToRootPage();
                    }
                }
            });

        });
    }

    goToRootPage() {
        let welcome = this.modalCtrl.create( SignupLoginPage );
        welcome.present();
        this.nav.setRoot(TabsPage);
    }

    goRoot() {
        this.nav.setRoot(TabsPage);
    }

    checkExistingToken() {
        this.authService.checkExistingToken();
    }

    checkChargingProgress() {
        this.chargingService.checkChargingState();
    }

    /**
     * get users tracking flag on login and enable/disable tracker service
     */
    checkTrackingOnLogin() {
        let user: User = this.authService.getUser();

        if (!user.hasTrackingFlag()) {
            user.trackingEnable();
        }

        if (user.isTrackingDisabled()) {
            this.trackerService.disable();
        }
        else {
            this.trackerService.enable();
        }
    }

    refreshUser(checkChargingProcess?: boolean) {
        this.userService.getUser().subscribe(
            (user) => {
                this.authService.setUser(user);
                this.languageService.setLanguageFromUser();
                if (checkChargingProcess) {
                    this.checkChargingProgress();
                }
                this.events.publish('user:refreshed');
            },
            (error) => {
                /**
                 * If we can't refresh the user, the token is expired, user deleted etc.
                 * For now we just logout the user (which clears the token)
                 */
                this.authService.logout();
            });
    }

    updateUserDeviceToken() {
        //-- deactivated for now as we don't sent any push notifs, yet (#150037805)

        // let deviceToken = this.pushNotificationService.getDeviceToken();
        //
        // if (deviceToken === '') {
        //     return;
        // }
        //
        // let user = this.authService.getUser();
        // let currentPlatform = this.platform.is('ios') ? 'ios' : 'android';
        //
        // if (!user.deviceTokenExists(deviceToken)) {
        //     user.addDeviceToken(deviceToken, currentPlatform);
        //     this.userService.updateUser(user).subscribe((updatedUser) => {
        //             this.authService.setUser(updatedUser);
        //         },
        //         error => this.errorService.displayErrorWithKey(error, this.translateService.instant('_global.data_protection.refresh_user')));
        // }
    }

    /**
     * called when charging process is lapsed/run out (without the user hitting the stop button)
     */
    chargingLapsed() {
        let toast = this.toastCtrl.create({
            message: this.translateService.instant('app.loading_success'),
            showCloseButton: true,
            closeButtonText: this.translateService.instant('common.ok'),
            position: 'top',
            dismissOnPageChange: false
        });

        toast.onDidDismiss(() => {
            let chargingCompletedModal = this.modalCtrl.create(ChargingCompletePage);
            chargingCompletedModal.present();
        });

        toast.present();
    }

    /**
     * Man, handling the hardware back button is really a rabbit hole. There's currently no
     * working, reliable way with ionic. In this function we try our best to close modals etc.
     * and in the end ask the user if he wants to close the app.
     * Inspiration: https://github.com/driftyco/ionic/issues/6982#issuecomment-254740855
     */
    handleBackButton() {
        //-- close modals etc. and menus
        let activePortal = this.ionicApp._loadingPortal.getActive() ||
            this.ionicApp._modalPortal.getActive() ||
            this.ionicApp._toastPortal.getActive() ||
            this.ionicApp._overlayPortal.getActive();

        if (activePortal) {
            activePortal.dismiss();
            return;
        }

        if (this.menuCtrl.isOpen()) {
            this.menuCtrl.close();
            return;
        }

        let nav = this.app.getActiveNav();
        let view = nav.getActive();
        let page = view ? nav.getActive().instance : null;

        let doExit = false;

        if (page && page.isRootPage) {
            doExit = true;
        }
        else if (nav.canGoBack() || view && view.isOverlay) {
            nav.pop();
        }
        // else if (localStorage.getItem('is_logged_in')) {
        //     nav.setRoot(HomePage);
        // }
        // else if (!localStorage.getItem('is_logged_in')) {
        //     this.platform.exitApp();
        // }
        else {
            doExit = true;
        }

        if (doExit) {
            this.alertCtrl.create({
                title: this.translateService.instant('common.confirmation'),
                message: this.translateService.instant('app.cancel_app'),
                buttons: [
                    {
                        text: this.translateService.instant('common.cancel'),
                        role: 'cancel'
                    },
                    {
                        text: this.translateService.instant('app.cancel_app_ok'),
                        handler: () => {
                            this.platform.exitApp();
                        }
                    }
                ]
            }).present();
        }
    }
}
