import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';

import {MapPage} from '../map/map';
import {AboutPage} from '../about/about';
import {AddCarPage} from '../car/add/add-car';
import {SignupPage} from '../signup/signup';
import {AddStationPage} from '../station/add/add-station';
import {WalletPage} from '../wallet/wallet';
import {MyCarsPage} from '../car/my-cars/my-cars';
import {DashboardPage} from '../dashboard/dashboard';
import {AuthService} from "../../services/auth.service";
import {LoginPage} from "../login/login";


@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root: any = MapPage;
    tab2Root: any = AboutPage;
    tab3Root: any = AddStationPage;
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
        let modal = this.modalCtrl.create(AddCarPage);
        modal.present();

    }

    addStationModal() {
        let modal = this.modalCtrl.create(AddStationPage);
        modal.present();
    }

    myCarsModal() {
        let modal = this.modalCtrl.create(MyCarsPage);
        modal.present();
    }
}
