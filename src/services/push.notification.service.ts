import {Injectable} from "@angular/core";
import {Push, PushNotification} from "ionic-native";


@Injectable()
export class PushNotificationService {
    push: PushNotification = null;
    deviceToken: string = '';


    constructor() {

    }

    initPushNotification() {
        if (!(window as any).cordova) {
            // console.log('Skipping registration of Push Notifications in browser');
            return;
        }

        if (this.push !== null) {
            // console.log('Push Notification already registered on this device');
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
            // console.log(data.registrationId);

            this.deviceToken = data.registrationId.toString();
        });
        this.push.on('notification', (data) => {
            // console.log('message', data.message);

            if (data.additionalData.foreground) {
                // console.log('Foreground push');
            } else {
                // console.log("Push notification clicked");
            }
        });
        this.push.on('error', (e) => {
            // console.log(e.message);
        });
    }

    getDeviceToken() {
        return this.deviceToken;
    }
}
