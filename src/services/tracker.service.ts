import {Injectable} from '@angular/core';
import {ConfigService} from "./config.service";
import {User} from "../models/user";

declare var mixpanel: any;

@Injectable()
export class TrackerService {

    constructor(private configService: ConfigService) {
    }

    init() {
        let token = this.configService.get('MIXPANEL_TOKEN');
        mixpanel.init(token, {api_host: "https://api.mixpanel.com"});
    }

    track(event: string, properties?: any) {
        if (properties && '' == properties.Timestamp) {
            // in UTC (+0)
            properties.Timestamp = (new Date().toISOString()).replace('T', ' ');
        }
        console.log('Track: ', event, properties);
        mixpanel.track(event, properties);
    }

    userSet(properties: any) {
        mixpanel.people.set(properties);
    }

    identify(user: User) {
        console.log('Tracker ident: ', user.address);
        mixpanel.identify(user.address);
    }

    alias(user: User) {
        console.log('Tracker alias: ', user.address);
        mixpanel.alias(user.address);
    }

    reset() {
        console.log('Tracker Reset');
        mixpanel.reset();
    }
}
