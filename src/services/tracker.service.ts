import {Injectable} from '@angular/core';
import {ConfigService} from "./config.service";

declare var mixpanel: any;

@Injectable()
export class TrackerService {

    constructor(private configService: ConfigService) {

        console.log('Hello TrackerService Provider');
    }

    init() {
        let token = this.configService.get('MIXPANEL_TOKEN');
        mixpanel.init(token, {api_host: "https://api.mixpanel.com"});
    }

    track(event: string, properties?: any) {
        mixpanel.track(event, properties);
    }
}
