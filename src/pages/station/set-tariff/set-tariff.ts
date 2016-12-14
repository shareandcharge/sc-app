import {Component} from '@angular/core';
import {NavController, NavParams , AlertController} from 'ionic-angular';
import {MyStationsPage} from '../my-stations/my-stations';
import {LocationService} from "../../../services/location.service";


@Component({
    selector: 'page-set-tariff',
    templateUrl: 'set-tariff.html',
    providers: [LocationService]

})
export class SetTariffPage {
    locObject: any;
    segmentTabs: any;
    energyRate: any;
    parkRate: any;
    flowMode:any;
    buttonText:any;

    constructor(public navCtrl: NavController,private alertCtrl: AlertController, private navParams: NavParams, public locationService: LocationService) {
        this.segmentTabs = 'default';
        this.locObject = this.navParams.get("loc");
        this.flowMode = this.navParams.get("mode");

        if(this.flowMode == 'edit'){
            this.buttonText = "Update";
        }
        else{
            this.buttonText = "Publish";
        }

        console.log(this.locObject);

        if(typeof this.locObject.stations.energyRate != 'undefined'){
            this.energyRate = this.locObject.stations.energyRate;
        }

        if(typeof this.locObject.stations.parkRate != 'undefined'){
            this.parkRate = this.locObject.stations.parkRate;
        }

    }

    ionViewDidLoad() {
    }

    deleteStation(){
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
    publish() {

        this.locObject.stations.energyRate = this.energyRate;
        this.locObject.stations.parkRate = this.parkRate;

        if(this.flowMode == 'add'){
            this.locationService.createLocation(this.locObject).subscribe(l => {

                this.navCtrl.setRoot(MyStationsPage);
                console.log("created location ", l);
            });
        }

        else{
            this.locationService.updateLocation(this.locObject).subscribe(l => {

                this.navCtrl.setRoot(MyStationsPage);
                console.log("updated location ", l);
            });
        }

        //this.navCtrl.setRoot(MyStationsPage);
    }

}
