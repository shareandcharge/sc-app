import {Injectable} from '@angular/core';
import {CONFIG} from '../config/config';

@Injectable()
export class CurrencyService {

  private USD_PILOT: boolean = CONFIG.FEATURE_TOGGLES.usd_pilot;
  private HIDE_PAYMENT: boolean = CONFIG.FEATURE_TOGGLES.hide_payment;
  private HIDE_COMMERCIAL_OPTION : boolean = CONFIG.FEATURE_TOGGLES.hide_commercial_option;

  getCurrency(): string {
    return (this.USD_PILOT ? '$' : '€');
  }

  isPaymentAvailable(): boolean {
  	return (!this.HIDE_PAYMENT);
  }

  isCommercialOptionHidden(): boolean {
  	return this.HIDE_COMMERCIAL_OPTION;
  }

}
