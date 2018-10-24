import {Pipe} from '@angular/core';
import {CurrencyService} from "../services/currency.service";
import {CONFIG} from '../config/config';

@Pipe({
  name: 'walletDisplay'
})
export class WalletDisplay {

    globalCurrency: string = '';
    isUSD: boolean = false;

    constructor( currencyService: CurrencyService){
      this.globalCurrency = currencyService.getCurrency();
      this.isUSD = CONFIG.FEATURE_TOGGLES.usd_pilot
    }

    transform(value: number,
        currencySign: string = '',
        decimalLength: number = 2,
        chunkDelimiter: string = (this.isUSD ? ',' : '.'),
        decimalDelimiter:string = (this.isUSD ? '.' : ','),
        chunkLength: number = 3): string {

            value /= 100;

            let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : currencySign) + ')';
            let num = value.toFixed(Math.max(0, ~~decimalLength));

            return ((decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter));
        }
}
