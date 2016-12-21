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

    flowMode: any;
    buttonText: any;

    hourlyTarif = false;
    kwhTarif = false;

    tarifObject:any;


    constructor(public navCtrl: NavController, private alertCtrl: AlertController, private modalCtrl: ModalController, private navParams: NavParams, public locationService: LocationService) {
        this.locObject = this.navParams.get("location");
        this.flowMode = this.navParams.get("mode");

        if (this.flowMode == 'edit') {
            this.buttonText = "Update";
        }
        else {
            this.buttonText = "Publish";
        }



        if (this.locObject.stations.accessControl) {
            this.hourlyTarif = true;
            if (this.locObject.stations.kwh) {
                this.kwhTarif = true;
                this.hourlyTarif = false;
            }
        }

        this.tarifObject = {
            public : {
                active : false,
                selected : 'flatrate',
                flatrate : {
                    flatrateRate : 0
                },
                hourly : {
                    hourlyRate : 0,
                    parkRate : 0
                },
                kwh : {
                    kwhRate : 0,
                    parkRate : 0
                }
            },
            private : {
                active : false,
                selected : 'flatrate',
                flatrate : {
                    flatrateRate : 0
                },
                hourly : {
                    hourlyRate : 0,
                    parkRate : 0
                },
                kwh : {
                    kwhRate : 0,
                    parkRate : 0
                },
                permissions: []
            }
        }

        if (typeof this.locObject.stations.tarif != 'undefined') {
            this.tarifObject = this.locObject.stations.tarif;

            if (!this.hourlyTarif && this.tarifObject.private.selected == 'hourly') {
                this.tarifObject.private.selected = 'flatrate';
            }
            if (!this.hourlyTarif && this.tarifObject.public.selected == 'hourly') {
                this.tarifObject.public.selected = 'flatrate';
            }
            if (!this.kwhTarif && this.tarifObject.private.selected == 'kwh') {
                this.tarifObject.private.selected = 'flatrate';
            }
            if (!this.kwhTarif && this.tarifObject.public.selected == 'kwh') {
                this.tarifObject.public.selected = 'flatrate';
            }
        }
        else {
            this.locObject.stations.tarif = this.tarifObject;
        }

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
            "permissions": this.tarifObject.private.permissions
        });

        modal.onDidDismiss(permissions => {
            this.tarifObject.private.permissions = permissions;
            console.log(this.tarifObject.private.permissions);
        });

        modal.present();
    }

    publish() {
        if (this.tarifObject.public.active || this.tarifObject.private.active) {
            this.locObject.stations.tarif = this.tarifObject;


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
