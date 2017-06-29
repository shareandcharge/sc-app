import {Injectable} from '@angular/core';
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ConfigService} from "./config.service";

@Injectable()
export abstract class AbstractApiService {
    protected baseUrl;
    
    constructor(public configService: ConfigService, public translateService: TranslateService) {
        this.baseUrl = this.configService.getApiBaseUrl();
    }

    handleError(error: Response | any) {
        let errMsg: string;
        error = error || this.translateService.instant('error.unknown');

        if (error instanceof Response) {
            if (error.status == 0) {
                errMsg = this.translateService.instant('error_messages.no_connection');
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
