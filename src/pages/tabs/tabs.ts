import {Component, ViewChild} from '@angular/core';
import {ModalController, Tabs} from 'ionic-angular';
import {MapPage} from '../map/map';
// import {AboutPage} from '../about/about';
import {IntroPage} from '../intro/intro';
import {WalletPage} from '../wallet/wallet';
import {ProfilePage} from '../profile/profile';
import {AuthService} from "../../services/auth.service";
import {ErrorService} from "../../services/error.service";
// import {MyStationsPage} from "../station/my-stations/my-stations";
// import {StationWrapperPage} from "../station/station-wrapper";
import {SignupLoginPage} from "../signup-login/signup-login";


@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = MapPage;
    tab2Root = null;
    tab3Root = null;
    tab4Root = ProfilePage;
    tab5Root = WalletPage;

    @ViewChild('tabs') tabRef: Tabs;

    private tempTabIndex = 3;

    constructor(public modalCtrl: ModalController, public auth: AuthService, public error: ErrorService) {
    }

    signupModal() {
        this.displayModal(SignupLoginPage, {
            'action' : 'signUp',
            'trackReferrer': 'Tab Registrieren'
        });
    }

    loginModal(data?) {
        this.displayModal(SignupLoginPage, data);
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
        this.error.displayError('This feature is currently disabled', 'Disabled');
        // if (this.auth.loggedIn()) {
        //     let modal = this.modalCtrl.create(StationWrapperPage);
        //     modal.present();

        // }
        // else {
        //     this.loginModal({
        //         "dest": StationWrapperPage,
        //         'mode' : 'modal',
        //         'action' : 'login',
        //         'trackReferrer': 'Tab Ladestationen'
        //     });
        // }
    }

    showIntro() {
        let introModal = this.modalCtrl.create(IntroPage);
        introModal.present();
    }
}
