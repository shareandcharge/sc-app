import {Component} from '@angular/core';
import {Platform, Events, LoadingController} from 'ionic-angular';
import {StatusBar, Splashscreen, Push} from 'ionic-native';
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

    constructor(platform: Platform, private authService: AuthService, private userService: UserService, private chargingService: ChargingService, private events: Events, public loadingCtrl: LoadingController, public storage: Storage, private translateService: TranslateService) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();

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

            // let push = Push.init({
            //     android: {
            //         senderID: "183711573057"
            //     },
            //     ios: {
            //         alert: "true",
            //         badge: true,
            //         sound: "false"
            //     },
            //     windows: {}
            // });
            // push.on('registration', (data) => {
            //     console.log(data.registrationId);
            //     alert(data.registrationId.toString());
            // });
            // push.on('notification', (data) => {
            //     console.log('message', data.message);
            //     let self = this;
            //     //if user using app and push notification comes
            //     if (data.additionalData.foreground) {
            //         alert('New Notif: ' + data.message);
            //         // if application open, show popup
            //         // let confirmAlert = this.alertCtrl.create({
            //         //     title: 'New Notification',
            //         //     message: data.message,
            //         //     buttons: [{
            //         //         text: 'Ignore',
            //         //         role: 'cancel'
            //         //     }, {
            //         //         text: 'View',
            //         //         handler: () => {
            //         //             //TODO: Your logic here
            //         //             // self.nav.push(DetailsPage, {message: data.message});
            //         //         }
            //         //     }]
            //         // });
            //         // confirmAlert.present();
            //     } else {
            //         //if user NOT using app and push notification comes
            //         //TODO: Your logic on click of push notification directly
            //         // self.nav.push(DetailsPage, {message: data.message});
            //         console.log("Push notification clicked");
            //     }
            // });
            // push.on('error', (e) => {
            //     console.log(e.message);
            // });
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
            this.checkChargingProgress();
            this.events.publish('user:refreshed');
        });
    }

}
