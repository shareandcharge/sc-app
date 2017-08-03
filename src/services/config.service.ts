import {AuthHttp} from "angular2-jwt";
import {Injectable} from "@angular/core";
import {CONFIG} from "../config/config"
import {Observable} from "rxjs";

@Injectable()
export class ConfigService {

    private apiBaseUrl: string;
    private conf: any;
    /**
     * we can't use httpService here as it relies on us (config); would give a circular reference...
     * @param authHttp
     */
    constructor(private authHttp: AuthHttp) {
        this.conf = CONFIG;
        this.apiBaseUrl = this.getApiBaseUrl();
    }

    /**
     *
     * @returns {Observable<any>}
     */
    getPlugTypes(): Observable<any> {
        return this.authHttp.get(`${this.apiBaseUrl}/connectors/plugtypes`)
            .map(res => res.json());
    }

    isFeatureEnabled(feature: string): boolean {
        if (!this.conf.FEATURE_TOGGLES) {
            throw new Error(`FEATURE_TOGGLES not defined in config.ts`);
        }

        if (!this.conf.FEATURE_TOGGLES.hasOwnProperty(feature)) {
            throw new Error(`Feature not set: ${feature}`);
        }

        return this.conf.FEATURE_TOGGLES[feature];
    }

    /**
     *
     * @param key
     * @returns {any}
     */
    get(key: string): any {
        if (!this.conf[key]) {
            throw new Error(`Config key not set: ${key}`);
        }

        return this.conf[key];
    }

    /**
     * API_URL
     * @returns {any}
     */
    getApiBaseUrl(): any {
        return this.get('API_URL');
    }

    /**
     * API_KEY
     * @returns {string}
     */
    getApiKey(): string {
        return this.get('API_KEY');
    }

    getVersionNumber(): string {
      return this.get('APP_VERSION');
    }
}
