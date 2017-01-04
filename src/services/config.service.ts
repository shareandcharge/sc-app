import {AuthHttp} from "angular2-jwt";

export class ConfigService {
    constructor(private authHttp: AuthHttp) {}

    getPlugTypes() {
        return this.authHttp.get('https://api-test.shareandcharge.com/v1/connectors/plugtypes')
            .map(res => res.json());
    }
}