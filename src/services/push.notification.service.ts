import {Injectable} from "@angular/core";
import {Push} from "ionic-native";
import {User} from "../models/user";
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";
import {Platform} from "ionic-angular";


@Injectable()
export class PushNotifictaionService {


    constructor(private userService: UserService, private authService: AuthService, private platform: Platform) {

    }

    registerPushNotification(user: User) {
        if (!(window as any).cordova) {
            console.log('Skipping registration of push in browser');
            return;
        }

        let push = Push.init({
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
        push.on('registration', (data) => {
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
        push.on('notification', (data) => {
            console.log('message', data.message);
            let self = this;
            //if user using app and push notification comes
            if (data.additionalData.foreground) {
                alert('New Notif: ' + data.message);
                console.log('Foregroud push');
            } else {
                //if user NOT using app and push notification comes
                //TODO: Your logic on click of push notification directly
                // self.nav.push(DetailsPage, {message: data.message});
                console.log("Push notification clicked");
            }
        });
        push.on('error', (e) => {
            console.log(e.message);
        });
    }
}
