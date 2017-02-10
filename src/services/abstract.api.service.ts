import {Injectable} from '@angular/core';
import {Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export abstract class AbstractApiService {

    handleError(error: Response | any) {
        let errMsg: string;
        error = error || 'Unbekannter Fehler';

        if (error instanceof Response) {
            if (error.status == 0) {
                errMsg = 'No connection';
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

                //--@TODO remove after testing
                if (body.message) alert('DEBUG: ' + body.message);
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        // console.error('API error:', errMsg);
        return Observable.throw(errMsg);
    }

}
