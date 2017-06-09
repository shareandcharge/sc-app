import {Injectable} from '@angular/core';
import {AlertController} from "ionic-angular";
import {TranslateService} from "ng2-translate";
import {Response} from "@angular/http";

@Injectable()
export class ErrorService {

    constructor(private alertCtrl: AlertController, private translateService: TranslateService) {
    }

    displayErrorWithKey(error?: any, subtitle?: string) {
        let key = this.getMessage(error);

        this.translateService.get(key).subscribe(value => this.displayError(value, subtitle));
    }

    displayError(error: any, subtitle = this.translateService.instant('error.subtitle')) {
        let message = this.getMessage(error);

        let alert = this.alertCtrl.create({
            title: this.translateService.instant('error.title'),
            subTitle: subtitle,
            message: message,
            buttons: [this.translateService.instant('common.close')]
        });

        alert.present();
    }

    getMessage(error?: Response | any): string {
        let errMsg: string;
        error = error || this.translateService.instant('error.unknown');

        if (error instanceof Response) {
            let body;
            try {
                body = error.json();
            }
            catch (e) {
                body = error.text();
            }
            errMsg = body.key || body.message || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        return errMsg;
    }
}
