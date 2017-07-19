import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class CurrencyService {

  private USD_PILOT: boolean = true;

  constructor(private translateService: TranslateService){

  }

  getCurrency() {
    return (this.USD_PILOT ? '$' : '€')
  }

}
