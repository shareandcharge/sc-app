import {Injectable} from "@angular/core";
import {Push, PushNotification} from "ionic-native";
import {User} from "../models/user";
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";
import {Platform} from "ionic-angular";


@Injectable()
export class PushNotificationService {
    push: PushNotification = null;


    constructor(private userService: UserService, private authService: AuthService, private platform: Platform) {

    }

    registerPushNotification(user: User) {
        if (!(window as any).cordova) {
            console.log('Skipping registration of Push Notifications in browser');
            return;
        }

        if (this.push !== null) {
            console.log('Push Notification already registered on this device');
            return;
        }

        this.push = Push.init({
            android: {
                senderID: "183711573057"
            },
            ios: {
                alert: "true",
                badge: true,
                sound: "false"
            },
            windows: {}
        });

        this.push.on('registration', (data) => {
            console.log(data.registrationId);

            let tokenArray = this.platform.is('ios') ? user.authentification.apnDeviceTokens : user.authentification.gcmDeviceTokens;

            if (typeof tokenArray === 'undefined') {
                tokenArray = [];
            }

            if (tokenArray.indexOf(data.registrationId) === -1) {
                tokenArray.push(data.registrationId.toString());
                this.userService.updateUser(user).subscribe((updatedUser) => {
                    this.authService.setUser(updatedUser);
                });
            }
        });
        this.push.on('notification', (data) => {
            console.log('message', data.message);

            if (data.additionalData.foreground) {
                console.log('Foreground push');
            } else {
                console.log("Push notification clicked");
            }
        });
        this.push.on('error', (e) => {
            console.log(e.message);
        });
    }
}
