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
        return Observable.throw(this.getErrorMessage(error));
    }

    private getErrorMessage(error: Response | any) {
        if (error instanceof Response) {

            if (error.status == 0) {
                return 'error_messages.no_connection';
            } else {
                try {
                    let body = error.json();
                    return 'api_error.' + body.key;
                } catch (e) {
                    return '';
                }
            }
        }

        return '';
    }

}
