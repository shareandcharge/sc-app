import {Injectable} from '@angular/core';
import {ConfigService} from "./config.service";

declare var mixpanel: any;

@Injectable()
export class TrackerService {

    private disabled: boolean = false;

    constructor(private configService: ConfigService) {
    }

    init() {
        let token = this.configService.get('MIXPANEL_TOKEN');
        mixpanel.init(token, {
            api_host: "https://api.mixpanel.com",
            disable_persistence: true
        });
    }

    track(event: string, properties?: any) {
        if (properties && '' == properties.Timestamp) {
            // in UTC (+0)
            properties.Timestamp = (new Date().toISOString()).replace('T', ' ');
        }
        console.log('Track: ', event, properties);
        mixpanel.track(event, properties);
    }

    disable() {
        mixpanel.disable();
        this.disabled = true;
    }

    reset() {
        mixpanel.reset();
    }

    /**
     * we must not track personal/personalized data,
     * so we don't use the following functions
     */

    /*
    userSet(properties: any) {
        mixpanel.people.set(properties);
    }

    identify(user: User) {
        mixpanel.identify(user.address);
    }

    alias(user: User) {
        mixpanel.alias(user.address);
    }
    */

}
