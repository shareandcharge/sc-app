import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";

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
}