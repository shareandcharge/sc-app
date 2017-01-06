import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class PaymentService {
    private baseUrl: string = 'https://api-test.shareandcharge.com/v1';

    constructor(private authHttp: AuthHttp) {}

    getHistory() {
        return this.authHttp.get(this.baseUrl + '/wallet/history')
            .map(res => res.json());
    }

    getBalance() {
        return this.authHttp.get(this.baseUrl + '/wallet/balance')
            .map(res => res.json());
    }

    payIn(payInObject) {
        return this.authHttp.post(this.baseUrl + '/wallet/payIn', JSON.stringify(payInObject))
            .map(res => res.json());
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body.message  || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}