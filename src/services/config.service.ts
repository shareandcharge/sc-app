import {AuthHttp} from "angular2-jwt";
import {Injectable} from "@angular/core";
import {CONFIG} from "../config/config"

@Injectable()
export class ConfigService {
    constructor(private authHttp: AuthHttp) {}

    getPlugTypes() {
        return this.authHttp.get('https://api-test.shareandcharge.com/v1/connectors/plugtypes')
            .map(res => res.json());
    }

    getBaseUrl() {
        return CONFIG.API_URL;
    }
}