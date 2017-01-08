import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {AbstractApiService} from "./abstract.api.service";

@Injectable()
export class PaymentService extends AbstractApiService {
    private baseUrl: string = 'https://api-test.shareandcharge.com/v1';

    constructor(private authHttp: AuthHttp) {
        super();
    }

    getHistory() {
        return this.authHttp.get(this.baseUrl + '/wallet/history')
            .map(res => res.json())
            .catch(this.handleError);
    }

    getBalance() {
        return this.authHttp.get(this.baseUrl + '/wallet/balance')
            .map(res => res.json())
            .catch(this.handleError);
    }

    payIn(payInObject) {
        return this.authHttp.post(this.baseUrl + '/wallet/payIn', JSON.stringify(payInObject))
            .map(res => res.json())
            .catch(this.handleError);
    }
}