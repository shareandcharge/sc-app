import {Injectable} from '@angular/core';
import {Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export abstract class AbstractApiService {

    handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body.key || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error('API error:', errMsg);
        return Observable.throw(errMsg);
    }

}
