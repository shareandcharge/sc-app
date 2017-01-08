import {Injectable} from '@angular/core';
import {Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export abstract class AbstractApiService {

    handleError(error: Response | any) {
        let errMsg: string;
        error = error || 'Unbekannter Fehler';

        if (error instanceof Response) {
            let body;
            try {
                body = error.json();
            }
            catch (e) {
                body = error.text();
            }
            errMsg = body.key || body.message || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error('API error:', errMsg);
        return Observable.throw(errMsg);
    }

}
