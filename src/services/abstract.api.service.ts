import {Injectable} from '@angular/core';
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {ConfigService} from "./config.service";

@Injectable()
export abstract class AbstractApiService {
    protected baseUrl;

    constructor(public configService: ConfigService) {
        this.baseUrl = this.configService.getBaseUrl();
    }

    handleError(error: Response | any) {
        let errMsg: string;
        error = error || 'Unbekannter Fehler';

        if (error instanceof Response) {
            if (error.status == 0) {
                errMsg = 'Keine Verbindung.';
            }
            else {
                let body;
                try {
                    body = error.json();
                }
                catch (e) {
                    body = error.text();
                }

                errMsg = body.key || body.message || JSON.stringify(body);
                errMsg = "api_error." + errMsg;

                // if (body.message) alert('DEBUG: ' + body.message);
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        // console.error('API error:', errMsg);
        return Observable.throw(errMsg);
    }

}
