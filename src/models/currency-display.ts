import {Pipe} from '@angular/core';
import {CurrencyService} from "../services/currency.service";

@Pipe({name: 'currencyDisplay'})
export class CurrencyDisplay {

    globalCurrency: string = '';

    constructor( currencyService: CurrencyService){
      this.globalCurrency = currencyService.getCurrency();
    }

    transform(value: number,
        currencySign: string = this.globalCurrency,
        decimalLength: number = 2,
        chunkDelimiter: string = '.',
        decimalDelimiter:string = ',',
        chunkLength: number = 3): string {

            value /= 100;

            let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : currencySign) + ')';
            let num = value.toFixed(Math.max(0, ~~decimalLength));

            return currencySign+(decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);
        }
}
