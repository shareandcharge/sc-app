import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {ConfigService} from "../../../services/config.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ErrorService} from "../../../services/error.service";


@Component({
    templateUrl: 'filter.html',
    selector: 'filter-page'
})
export class MapFilterPage {
    plugTypes: any;
    toggledPlugs: Array<any>;

    constructor(public viewCtrl: ViewController, private configService: ConfigService, private sanitizer: DomSanitizer, private navParams: NavParams, private errorService: ErrorService) {
        this.toggledPlugs = this.navParams.get('toggledPlugs');

        this.configService.getPlugTypes().subscribe((plugTypes) => {
            this.plugTypes = plugTypes;

            this.plugTypes.forEach((plug) => {
                plug.toggled = false;

                if (this.toggledPlugs.length === 0 || this.toggledPlugs.indexOf(plug.id) !== -1) {
                    plug.toggled = true;
                }
            })
        },
        error => this.errorService.displayErrorWithKey(error, 'Liste - Steckertypen'))
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

        this.viewCtrl.dismiss(toggledPlugs);
    }
}