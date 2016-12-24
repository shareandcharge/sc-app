import {Component, ViewChild} from '@angular/core';
import {ModalController, Tabs} from 'ionic-angular';

import {MapPage} from '../map/map';
import {AboutPage} from '../about/about';
import {CarFormPage} from '../car/form/car-form';
import {WalletPage} from '../wallet/wallet';
import {MyCarsPage} from '../car/my-cars/my-cars';
import {DashboardPage} from '../dashboard/dashboard';
import {AuthService} from "../../services/auth.service";
import {LoginPage} from "../login/login";
import {MyStationsPage} from "../station/my-stations/my-stations";
import {StationWrapperPage} from "../station/station-wrapper";


@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = MapPage;
    tab2Root = AboutPage;
    tab3Root = MyStationsPage;
    tab4Root = DashboardPage;
    tab5Root = WalletPage;

    @ViewChild('tabs') tabRef: Tabs;

    private tempTabIndex = 3;

    constructor(public modalCtrl: ModalController, public auth: AuthService) {
    }

    loginModal(data?) {
        let modal = this.modalCtrl.create(LoginPage, data);

        /**
         * This tab switching is a workaround to refresh the map view after login.
         * We could not find another working solution.
         */
        let selectedTab = this.tabRef.getSelected();

        modal.present().then(() => this.tabRef.select(this.tempTabIndex));
        modal.onWillDismiss(() => {
            this.tabRef.select(selectedTab);
        });
    }

    addCarModal() {
        let modal = this.modalCtrl.create(CarFormPage);
        modal.present();

    }

    addStationModal() {
        if (this.auth.loggedIn()) {
            let modal = this.modalCtrl.create(StationWrapperPage);
            modal.present();

        }
        else {
            this.loginModal({
                "dest": StationWrapperPage,
                'mode' : 'modal'
            });
        }
    }

    myCarsModal() {
        let modal = this.modalCtrl.create(MyCarsPage);
        modal.present();
    }
}
