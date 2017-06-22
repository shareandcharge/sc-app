import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {ConfigService} from "../../../services/config.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ErrorService} from "../../../services/error.service";
import {TranslateService} from "@ngx-translate/core";


@Component({
    templateUrl: 'filter.html',
    selector: 'filter-page'
})
export class MapFilterPage {
    plugTypes: any;
    toggledPlugs: Array<any>;

    constructor(public viewCtrl: ViewController, private configService: ConfigService, private sanitizer: DomSanitizer, private navParams: NavParams, private errorService: ErrorService, private translateService: TranslateService) {
        this.toggledPlugs = this.navParams.get('toggledPlugs');

        this.configService.getPlugTypes().subscribe((plugTypes) => {
                this.plugTypes = plugTypes;

                this.plugTypes.forEach((plug) => {
                    plug.toggled = this.toggledPlugs.length === 0 || this.toggledPlugs.indexOf(plug.id) !== -1;
                })
            },
            error => this.errorService.displayErrorWithKey(error, this.translateService.instant('map.filter.list_plugins')))
    }

    skipSanitizer(svg) {
        return this.sanitizer.bypassSecurityTrustHtml(svg);
    }

    dismiss() {
        let toggledPlugs = [];

        this.plugTypes.forEach((plug) => {
            if (plug.toggled) {
                toggledPlugs.push(plug.id);
            }
        });

        if (toggledPlugs.length == this.plugTypes.length) {
            toggledPlugs = [];
        }
        else if (!toggledPlugs.length) {
            /**
             * if all types are turned off (which not really makes sense because the locations
             * list will be empty then), we filter for a (hopefully) non existend plug type to get
             * an empty list. (we don't set plug filter in the api call if all types are selected...)
             */
            toggledPlugs.push(99999);
        }

        this.viewCtrl.dismiss(toggledPlugs);
    }
}