import {Injectable} from '@angular/core';
import {CONFIG} from '../config/config';

@Injectable()
export class CurrencyService {

  private USD_PILOT: boolean = CONFIG.FEATURE_TOGGLES.usd_pilot;
  private HIDE_PAYIN: boolean = CONFIG.FEATURE_TOGGLES.hide_payin;
  private HIDE_PAYOUT: boolean = CONFIG.FEATURE_TOGGLES.hide_payout;
  private HIDE_COMMERCIAL_OPTION : boolean = CONFIG.FEATURE_TOGGLES.hide_commercial_option;
  private HIDE_PAYPAL : boolean = CONFIG.FEATURE_TOGGLES.hide_paypal;

  getCurrency(): string {
    return (this.USD_PILOT ? '$' : '€');
  }

  isPayInAvailable(): boolean {
    return (!this.HIDE_PAYIN);
  }

  isPayOutAvailable(): boolean {
    return (!this.HIDE_PAYOUT);
  }

  isCommercialOptionHidden(): boolean {
  	return this.HIDE_COMMERCIAL_OPTION;
  }

  isPaypalAvailable(): boolean {
    return (!this.HIDE_PAYPAL)
  }

}
