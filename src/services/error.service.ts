import {Injectable} from '@angular/core';
import {AlertController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {Response} from "@angular/http";

@Injectable()
export class ErrorService {

    constructor(private alertCtrl: AlertController, private translateService: TranslateService) {
    }

    displayErrorWithKey(error?: any, subtitle?: string) {
        let key = this.getMessage(error);

        this.translateService.get(key).subscribe(value => this.displayError(value, subtitle));
    }

    displayError(error: any, subtitle = 'Das tut uns leid') {
        let message = this.getMessage(error);

        let alert = this.alertCtrl.create({
            title: 'Es trat ein Fehler auf',
            subTitle: subtitle,
            message: message,
            buttons: ['Schließen']
        });

        alert.present();
    }

    getMessage(error?: Response | any): string {
        let errMsg: string;
        error = error || 'Unbekannter Fehler';

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
