import {Component} from '@angular/core';
import {Platform, Events, LoadingController, Config} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {Storage} from '@ionic/storage';

import {TabsPage} from '../pages/tabs/tabs';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {ChargingService} from "../services/charging.service";
import {IntroPage} from '../pages/intro/intro';
import {TranslateService} from "ng2-translate";


@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
    rootPage: any = TabsPage;
    loader: any;

    constructor(private platform: Platform, private authService: AuthService, private userService: UserService, private chargingService: ChargingService, private events: Events, public loadingCtrl: LoadingController, public storage: Storage, private translateService: TranslateService, private config: Config) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();

            config.set('scrollAssist', true);

            translateService.setDefaultLang("de");
            translateService.use("de");

            this.checkExistingToken();


            this.storage.get('introShown').then((result) => {

                if (result) {
                    this.rootPage = TabsPage;
                } else {
                    this.rootPage = IntroPage;
                    this.storage.set('introShown', true);
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
}