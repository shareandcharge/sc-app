import {AuthHttp} from "angular2-jwt";
import {Injectable} from "@angular/core";
import {CONFIG} from "../config/config"
import {Observable} from "rxjs";

@Injectable()
export class ConfigService {

    apiBaseUrl: string;

    /**
     * we can't use httpService here as it relies on us (config); would give a circular reference...
     * @param authHttp
     */
    constructor(private authHttp: AuthHttp) {
        this.apiBaseUrl = this.getBaseUrl();
    }

    getPlugTypes(): Observable<any> {
        return this.authHttp.get(`${this.apiBaseUrl}/connectors/plugtypes`)
            .map(res => res.json());
    }

    getBaseUrl() {
        return CONFIG.API_URL;
    }

    getApiKey() {
        return CONFIG.API_KEY;
    }
}