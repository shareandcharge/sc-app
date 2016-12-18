import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';

import {MapPage} from '../map/map';
import {AboutPage} from '../about/about';
import {CarFormPage} from '../car/form/car-form';
import {SignupPage} from '../signup/signup';
import {AddStationPage} from '../station/add/add-station';
import {WalletPage} from '../wallet/wallet';
import {MyCarsPage} from '../car/my-cars/my-cars';
import {DashboardPage} from '../dashboard/dashboard';
import {AuthService} from "../../services/auth.service";
import {LoginPage} from "../login/login";
import {MyStationsPage} from "../station/my-stations/my-stations";


@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root: any = MapPage;
    tab2Root: any = AboutPage;
    tab3Root: any = MyStationsPage;
    tab4Root: any = DashboardPage;
    tab5Root: any = WalletPage;

    constructor(public modalCtrl: ModalController, public auth: AuthService) {

        if (auth.loggedIn()) {

        }
        else {

        }
    }

    signUpModal() {
        let modal = this.modalCtrl.create(SignupPage);
        modal.present();
    }

    loginModal() {
        let modal = this.modalCtrl.create(LoginPage);
        modal.present();
    }

    addCarModal() {
        let modal = this.modalCtrl.create(CarFormPage);
        modal.present();

    }

    addStationModal() {
        if (this.auth.loggedIn()) {
            let modal = this.modalCtrl.create(AddStationPage);
            modal.present();
        }
        else {
            let modal = this.modalCtrl.create(LoginPage, {
                "dest": AddStationPage
            });
            modal.present();
        }

    }

    myCarsModal() {
        let modal = this.modalCtrl.create(MyCarsPage);
        modal.present();
    }
}
