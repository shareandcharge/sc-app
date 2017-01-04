import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ModalController, Events} from 'ionic-angular';
import {LocationService} from "../../../services/location.service";
import {AddPermissionsPage} from './add-permissions/add-permissions';
import {Location} from "../../../models/location";
import {Connector} from "../../../models/connector";


@Component({
    selector: 'page-set-tariff',
    templateUrl: 'set-tariff.html',
    providers: []

})
export class SetTariffPage {
    locObject: Location;
    connector: Connector;
    priceprovider: any;

    flowMode: any;
    buttonText: any;

    hourlyTariff = false;
    kwhTariff = false;

    constructor(public navCtrl: NavController, private alertCtrl: AlertController, private modalCtrl: ModalController, private navParams: NavParams, public locationService: LocationService, private events: Events) {
        this.locObject = this.navParams.get("location");
        this.connector = this.locObject.stations[0].connectors[0];
        this.priceprovider = this.connector.priceprovider;

        this.flowMode = this.navParams.get("mode");

        if (this.flowMode == 'edit') {
            this.buttonText = "Veröffentlichen";
        }
        else {
            this.buttonText = "Veröffentlichen";
        }

        if (this.connector.metadata.accessControl) {
            this.hourlyTariff = true;
            if (this.connector.metadata.kwh) {
                this.kwhTariff = true;
                this.hourlyTariff = false;
            }
        }

    }

    showHelp(type) {
        let message = "";

        switch (type) {
            case "flatrate":
                message = "Pauschaler Betrag für eine maximale Ladedauer von 8 Stunden.";
                break;
            case "hourly":
                message = "Hier trägst Du die Energiekosten ein, die Du an Deinen Energieversorger bezahlst.";
                break;
            case "parking":
                message = "Hier trägst Du die Kosten ein, die Lader an Dich für die Nutzung deines Parkplatzes zahlen sollen.";
                break;
        }

        let alert = this.alertCtrl.create({
            title: 'Info',
            message: message,
            buttons: ['Ok']
        });
        alert.present();
    }

    addPermission() {
        let modal = this.modalCtrl.create(AddPermissionsPage, {
            "permissions": this.priceprovider.private.permissions
        });

        modal.onDidDismiss(permissions => {
            this.priceprovider.private.permissions = permissions;
            console.log(this.priceprovider.private.permissions);
        });

        modal.present();
    }

    publish() {
        if (this.priceprovider.public.active || this.priceprovider.private.active) {
            // we need to convert the provider to the format used in the backend
            this.connector.priceprovider = this.connector.toBackendPriceProvider(this.priceprovider);

            if (this.flowMode == 'add') {
                this.locationService.createLocation(this.locObject).subscribe(l => {
                    this.navCtrl.parent.pop();
                    this.events.publish('locations:updated', l);
                });
            } else {
                this.locationService.updateLocation(this.locObject).subscribe(l => {
                    this.navCtrl.parent.pop();
                    this.events.publish('locations:updated', l);
                });
            }
        } else {
            let alert = this.alertCtrl.create({
                title: 'Bitte wähle eine Tarifoption',
                subTitle: 'Es muss mindestens ein Tarifoption ausgewählt sein.',
                buttons: ['Ok']
            });
            alert.present();
        }
    }

}
