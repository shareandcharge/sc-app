import {Component} from '@angular/core';
import {Platform, Events, LoadingController} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {Storage} from '@ionic/storage';

import {TabsPage} from '../pages/tabs/tabs';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {ChargingService} from "../services/charging.service";
import {IntroPage} from '../pages/intro/intro';


@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
    rootPage: any = TabsPage;
    loader: any;

    constructor(platform: Platform, private authService: AuthService, private userService: UserService, private chargingService: ChargingService, private events: Events, public loadingCtrl: LoadingController, public storage: Storage) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();

            this.checkExistingToken();
            this.checkChargingProgress();

            this.storage.get('introShown').then((result) => {

                if (result) {
                    this.rootPage = TabsPage;
                } else {
                    this.rootPage = IntroPage;
                    this.storage.set('introShown', true);
                }

                this.loader.dismiss();
            });
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
        this.userService.getUser().subscribe((user) => {
            this.authService.setUser(user);
            this.events.publish('user:refreshed');
        });
    }

}
