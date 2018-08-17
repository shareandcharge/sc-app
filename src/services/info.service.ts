import {Injectable} from '@angular/core';
import {AlertController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class InfoService {

    constructor(private alertCtrl: AlertController, private translateService: TranslateService) {
    }

    displayInfo(infoMsg: string) {
        let alert = this.alertCtrl.create({
            title: this.translateService.instant('common.info'),
            message: this.translateService.instant(infoMsg),
            buttons: [this.translateService.instant('common.ok')]
        });
        alert.present();
    }    
}