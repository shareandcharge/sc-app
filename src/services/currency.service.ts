import {Injectable} from '@angular/core';
import {CONFIG} from '../config/config';

@Injectable()
export class CurrencyService {

  private USD_PILOT: boolean = CONFIG.FEATURE_TOGGLES.currency_sign_usd;
  private HIDE_PAYMENT: boolean = CONFIG.FEATURE_TOGGLES.hide_payment;

  getCurrency(): string {
    return (this.USD_PILOT ? '$' : '€');
  }

  isPaymentAvailable(): boolean {
  	return (!this.HIDE_PAYMENT);
  }

}
