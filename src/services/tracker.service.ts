import {Injectable} from '@angular/core';
import {ConfigService} from "./config.service";
import {Storage} from '@ionic/storage';

declare var mixpanel: any;

@Injectable()
export class TrackerService {

    private disabled: boolean = false;
    private disabledStorageKey: string = 'noSessionId';

    constructor(private configService: ConfigService, private storage: Storage) {
    }

    init() {
        let token = this.configService.get('MIXPANEL_TOKEN');
        mixpanel.init(token, {
            api_host: "https://api.mixpanel.com",
            disable_persistence: true
        });

        this.storage.get(this.disabledStorageKey).then((res) => {
            if (false === res || null === res || 'false' === res) {
                this.enable();
            }
            else {
                this.disable();
            }
        });
    }

    track(event: string, properties?: any) {
        if (this.disabled) return;

        if (properties && '' == properties.Timestamp) {
            // in UTC (+0)
            properties.Timestamp = (new Date().toISOString()).replace('T', ' ');
        }
        // console.log('Track: ', event, properties);
        mixpanel.track(event, properties);
    }

    enable() {
        this.disabled = false;
        // console.log('Tracker: enable');
        mixpanel.register({"$ignore": false});
        this.storage.set(this.disabledStorageKey, false);
    }

    disable() {
        this.disabled = true;
        // console.log('Tracker: disable');
        mixpanel.disable();
        mixpanel.register({"$ignore": true});
        this.storage.set(this.disabledStorageKey, true);
    }

    isDisabled(): boolean {
        return this.disabled;
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