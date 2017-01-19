import {Component, ViewChild} from '@angular/core';
import {ModalController, Tabs} from 'ionic-angular';
import {MapPage} from '../map/map';
import {AboutPage} from '../about/about';
import {WalletPage} from '../wallet/wallet';
import {DashboardPage} from '../dashboard/dashboard';
import {AuthService} from "../../services/auth.service";
import {LoginPage} from "../login/login";
import {MyStationsPage} from "../station/my-stations/my-stations";
import {StationWrapperPage} from "../station/station-wrapper";
import {SignupPage} from "../signup/signup";


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

    signupModal(data?) {
        this.displayModal(SignupPage, data);
    }

    loginModal(data?) {
        this.displayModal(LoginPage, data);
    }

    displayModal(page, data) {
        let modal = this.modalCtrl.create(page, data);

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
}
