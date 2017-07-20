import {Injectable} from '@angular/core';
import {CONFIG} from '../config/config';

@Injectable()
export class CurrencyService {

  private USD_PILOT: boolean = CONFIG.FEATURE_TOGGLES.CURRENCY_SIGN_USD;

  getCurrency(): string {
    return (this.USD_PILOT ? '$' : '€');
  }

}
