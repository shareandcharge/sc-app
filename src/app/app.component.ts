import {Component} from '@angular/core';
import {Platform, Events, LoadingController, Config, ModalController} from 'ionic-angular';
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


@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
    rootPage: any = TabsPage;
    loader: any;

    constructor(private platform: Platform, private modalCtrl: ModalController, private authService: AuthService, private userService: UserService, private chargingService: ChargingService, private events: Events, public loadingCtrl: LoadingController, public storage: Storage, private translateService: TranslateService, private config: Config, private pushNotificationService: PushNotificationService, private errorService: ErrorService) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.

            platform.resume.subscribe(() => {
                this.checkChargingProgress();
            });


            config.set('scrollAssist', true);

            StatusBar.styleDefault();
            Splashscreen.hide();

            this.pushNotificationService.initPushNotification();

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


            this.storage.get('introShown').then((result) => {

                this.rootPage = TabsPage;
                if (!result) {
                    this.storage.set('introShown', true);
                    let introModal = this.modalCtrl.create(IntroPage);
                    introModal.present();
                }

                this.loader.dismiss();
            });

            StatusBar.styleDefault();
        });
        this.presentLoading();
    }

    checkExistingToken() {
        this.events.subscribe('auth:refresh:user', () => this.refreshUser());
        this.authService.checkExistingToken();
    }

    checkChargingProgress() {
        this.chargingService.checkChargingState();
    }

    presentLoading() {

        this.loader = this.loadingCtrl.create({
            content: "Authenticating..."
        });

        this.loader.present();

    }

    refreshUser() {
        this.userService.getUser().subscribe(
            (user) => {
                this.authService.setUser(user);
                this.checkChargingProgress();
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
}