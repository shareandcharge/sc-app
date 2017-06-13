import {Injectable} from '@angular/core';
import {AlertController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {Response} from "@angular/http";

@Injectable()
export class ErrorService {

    constructor(private alertCtrl: AlertController, private translateService: TranslateService) {
    }

    displayErrorWithKey(error?: any, subtitle?: string) {
        let messageTrans = this.translateService.instant(this.getMessage(error));
        let subtitleTrans = typeof subtitle !== 'undefined' ? this.translateService.instant(subtitle) : subtitle;

        this.displayError(messageTrans, subtitleTrans);
    }

    displayError(error: any, subtitle = this.translateService.instant('error.subtitle')) {
        let message = this.getMessage(error);
        if (typeof subtitle === 'undefined') {
            subtitle = this.translateService.instant('error.default_subtitle');
        }
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
