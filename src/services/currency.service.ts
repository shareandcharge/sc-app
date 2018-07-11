import {Injectable} from '@angular/core';
import {CONFIG} from '../config/config';

@Injectable()
export class CurrencyService {

  // private HIDE_PAYIN: boolean = CONFIG.FEATURE_TOGGLES.hide_payin;
  // private HIDE_PAYOUT: boolean = CONFIG.FEATURE_TOGGLES.hide_payout;
  private HIDE_COMMERCIAL_OPTION : boolean = CONFIG.FEATURE_TOGGLES.hide_commercial_option;
  private HIDE_PAYPAL : boolean = CONFIG.FEATURE_TOGGLES.hide_paypal;

  getCurrency(): string {
    return '£';
  }

  isPayInAvailable(): boolean {
    return false;
  }

  isPayOutAvailable(): boolean {
    return false;
  }

  isCommercialOptionHidden(): boolean {
  	return this.HIDE_COMMERCIAL_OPTION;
  }

  isPaypalAvailable(): boolean {
    return (!this.HIDE_PAYPAL)
  }

}
