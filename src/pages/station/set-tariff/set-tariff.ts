import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ModalController} from 'ionic-angular';
import {MyStationsPage} from '../my-stations/my-stations';
import {LocationService} from "../../../services/location.service";
import {AddPermissionsPage} from './add-permissions/add-permissions';


@Component({
    selector: 'page-set-tariff',
    templateUrl: 'set-tariff.html',
    providers: []

})
export class SetTariffPage {
    locObject: any;
    segmentTabs: any;
    energyRate: any;
    kwhRate: any;
    parkRate: any;
    flowMode: any;
    buttonText: any;
    togglePublic: any;
    togglePrivate: any;
    hourlyTarif: any;
    kwhTarif: any;
    hourlyTarifTabs: any;
    kwhTarifTabs: any;
    flatrateTarif: any;
    hourlyRate: any;
    permissions: any;

    constructor(public navCtrl: NavController, private alertCtrl: AlertController, private modalCtrl: ModalController, private navParams: NavParams, public locationService: LocationService) {
        this.permissions = [];

        this.hourlyTarifTabs = 'flatrate';
        this.kwhTarifTabs = 'flatrate';

        this.hourlyTarif = false;
        this.kwhTarif = false;
        this.flatrateTarif = true;

        this.locObject = this.navParams.get("location");
        this.flowMode = this.navParams.get("mode");

        this.togglePublic = false;
        this.togglePrivate = false;

        if (this.flowMode == 'edit') {
            this.buttonText = "Update";
        }
        else {
            this.buttonText = "Publish";
        }

        if (this.locObject.stations.accessControl) {
            this.hourlyTarif = true;
            this.flatrateTarif = false;
            if (this.locObject.stations.kwh) {
                this.kwhTarif = true;
                this.hourlyTarif = false;
            }
        }

        if (typeof this.locObject.stations.tarif != 'undefined') {

            if (typeof this.locObject.stations.tarif.permissions != 'undefined') {
                console.log("getting tarif");
                this.permissions = this.locObject.stations.tarif.permissions;
            }

            this.energyRate = this.locObject.stations.tarif.flatrate;
            if (this.locObject.stations.tarif.type == 'public') {
                this.togglePublic = true;

                if (this.locObject.stations.tarif.tarif == 'flatrate') {
                    this.energyRate = this.locObject.stations.tarif.rate;
                }
                else {
                    this.hourlyRate = this.locObject.stations.tarif.rate;
                    this.kwhRate = this.locObject.stations.tarif.rate;
                    this.parkRate = this.locObject.stations.tarif.parking;
                }
            }
            else {
                this.togglePrivate = true;
                this.energyRate = this.locObject.stations.tarif.rate;
            }

        }
        else {
            this.locObject.stations.tarif = {};
        }

    }

    changeTogglePublic() {
        if (this.togglePublic) {
            this.togglePublic = true;
            this.togglePrivate = false;
        }
        /*else{
         this.togglePublic =  false;
         this.togglePrivate = true;
         }*/
    }

    changeTogglePrivate() {
        if (this.togglePrivate) {
            this.togglePublic = false;
            this.togglePrivate = true;
        }
        /*  else{
         this.togglePublic =  true;
         this.togglePrivate = false;
         }*/
    }

    ionViewDidLoad() {
    }

    deleteStation() {
        let alert = this.alertCtrl.create({
            title: 'Löschen bestätigen',
            message: 'Möchten Sie dieses Station wirklich löschen?',
            buttons: [
                {
                    text: 'Nein',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ja, löschen',
                    handler: () => {
                        this.locationService.deleteLocation(this.locObject.id).subscribe(locations => {
                            this.navCtrl.setRoot(MyStationsPage);
                        });
                    }
                }
            ]
        });
        alert.present();
    }

    addPermission() {

        let modal = this.modalCtrl.create(AddPermissionsPage, {
            "permissions": this.permissions
        });

        modal.onDidDismiss(permissions => {
            this.permissions = permissions;
            console.log(this.permissions);
        });

        modal.present();
    }

    publish() {

        let tarifObject;

        if (this.togglePublic) {
            let tarif, rate;

            if (this.flatrateTarif) {
                tarif = "flatrate";
                rate = this.energyRate;
            }
            else if (this.hourlyTarif) {
                tarif = "hourly";
                rate = this.hourlyRate;
            }
            else {
                tarif = "kwh";
                rate = this.kwhRate;
            }

            tarifObject = {
                "type": "public",
                "tarif": tarif,
                "rate": rate,
                "flatrate": this.energyRate,
                "parking": this.parkRate
            }
        }
        else {

            console.log("permissions are ", this.permissions);
            tarifObject = {
                "type": "private",
                "rate": this.energyRate,
                "flatrate": this.energyRate,
                "permissions": this.permissions
            };
        }

        this.locObject.stations.tarif = tarifObject;

        console.log(this.locObject.stations.tarif);


        if (this.flowMode == 'add') {
            this.locationService.createLocation(this.locObject).subscribe(l => {
                this.navCtrl.setRoot(MyStationsPage);
                console.log("created location ", l);
            });
        }

        else {
            this.locationService.updateLocation(this.locObject).subscribe(l => {

                this.navCtrl.setRoot(MyStationsPage);
                console.log("updated location ", l);
            });
        }

    }

}
