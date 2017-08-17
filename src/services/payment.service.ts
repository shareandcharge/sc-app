import {Injectable} from "@angular/core";
import {AbstractApiService} from "./abstract.api.service";
import {ConfigService} from "./config.service";
import {HttpService} from "./http.service";
import {Transaction} from "../models/transaction";
import {Observable} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class PaymentService extends AbstractApiService {
    constructor(private httpService: HttpService, configService: ConfigService,
                public translateService: TranslateService) {
        super(configService, translateService);
    }

    getHistory(): Observable<Transaction[]> {
        return this.httpService.get(this.baseUrl + '/wallet/history')
            .map(res => {
                let transactions = [];
                res.json().forEach(input => {
                    transactions.push(new Transaction().deserialize(input));
                });
                return transactions;
            })
            .catch((error) => this.handleError(error));
    }

    getBalance() {
        return this.httpService.get(this.baseUrl + '/wallet/balance')
            .map(res => res.json())
            .catch((error) => this.handleError(error));
    }

    payIn(payInObject) {
        return this.httpService.post(this.baseUrl + '/wallet/payIn', JSON.stringify(payInObject))
            .map(res => res.json())
            .catch((error) => this.handleError(error));
    }

    payOut(payOutObject) {
        return this.httpService.post(this.baseUrl + '/wallet/payOut', JSON.stringify(payOutObject))
            .map(res => res.json())
            .catch((error) => this.handleError(error));
    }

    getPaymentStatus(orderId) {
        return this.httpService.get(this.baseUrl + '/wallet/paymentStatus/' + orderId)
            .map(res => res.json())
            .catch((error) => this.handleError(error));
    }

    redeemVoucher(voucherCode) {
        let object = {
            'voucher' : voucherCode
        };

        return this.httpService.post(this.baseUrl + '/wallet/voucher', JSON.stringify(object))
            .map(res => {
                if (res.text()) {
                    res.json()
                }
            })
            .catch((error) => this.handleError(error));
    }
}
