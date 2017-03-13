import {Component} from '@angular/core';
import {
    Platform, Events, LoadingController, Config, ModalController, App, IonicApp,
    MenuController, AlertController
} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {Storage} from '@ionic/storage';

import {TabsPage} from '../pages/tabs/tabs';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {ChargingService} from "../services/charging.service";
import {IntroPage} from '../pages/intro/intro';
import {TranslateService} from "ng2-translate";
import {PushNotificationService} from "../services/push.notification.service";
import {ErrorService} from "../services/error.service";
import {TrackerService} from "../services/tracker.service";


@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
    rootPage: any = TabsPage;
    loader: any;

    constructor(private app: App, private platform: Platform, private modalCtrl: ModalController,
                private authService: AuthService, private userService: UserService,
                private chargingService: ChargingService, private events: Events, public loadingCtrl: LoadingController,
                public storage: Storage, private translateService: TranslateService, private config: Config,
                private pushNotificationService: PushNotificationService, private errorService: ErrorService,
                private ionicApp: IonicApp, private menuCtrl: MenuController, private alertCtrl: AlertController,
                private trackerService: TrackerService) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.

            trackerService.init();

            platform.resume.subscribe(() => {
                this.checkChargingProgress();
            });

            config.set('scrollAssist', true);

            StatusBar.styleDefault();
            Splashscreen.hide();

            this.pushNotificationService.initPushNotification();

            this.events.subscribe('auth:refresh:user', (checkChargingProcess?) => {
                this.refreshUser(checkChargingProcess);
            });
            this.events.subscribe('user:refreshed', () => {
                this.updateUserDeviceToken();
            });

            this.events.subscribe('auth:login', () => {
                this.updateUserDeviceToken();
                this.checkChargingProgress();
            });
            this.events.subscribe('auth:logout', () => {
                this.checkChargingProgress();
            });

            translateService.setDefaultLang("de");
            translateService.use("de");

            this.checkExistingToken();

            //-- Handle hardware back button for Android and Windows Phone (don't close the app on all backs)
            platform.registerBackButtonAction(() => this.handleBackButton(), 1);

            this.storage.get('introShown').then((result) => {
                this.rootPage = TabsPage;
                if (!result) {
                    this.storage.set('introShown', true);
                    let introModal = this.modalCtrl.create(IntroPage, {isOnboarding: true});
                    introModal.present();
                }
            });

            StatusBar.styleDefault();
        });
    }

    checkExistingToken() {
        this.authService.checkExistingToken();
    }

    checkChargingProgress() {
        this.chargingService.checkChargingState();
    }

    refreshUser(checkChargingProcess?: boolean) {
        this.userService.getUser().subscribe(
            (user) => {
                this.authService.setUser(user);
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
        let deviceToken = this.pushNotificationService.getDeviceToken();

        if (deviceToken === '') {
            return;
        }

        let user = this.authService.getUser();
        let currentPlatform = this.platform.is('ios') ? 'ios' : 'android';

        if (!user.deviceTokenExists(deviceToken)) {
            user.addDeviceToken(deviceToken, currentPlatform);
            this.userService.updateUser(user).subscribe((updatedUser) => {
                    this.authService.setUser(updatedUser);
                },
                error => this.errorService.displayErrorWithKey(error, 'Nutzer aktualisieren'));
        }
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