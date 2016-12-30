import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {SignupPage} from '../pages/signup/signup';
import {LoginPage} from '../pages/login/login';
import {MapPage} from '../pages/map/map';
import {AutocompletePage} from '../pages/map/autocomplete/autocomplete';
import {AddStationPage} from '../pages/station/add/add-station';
import {CarManufacturerPage} from '../pages/car/form/manufacturer/car-manufacturer';
import {CarModelPage} from '../pages/car/form/model/car-model';
import {CarFormPage} from '../pages/car/form/car-form';
import {MapSettingsPage} from '../pages/map/settings/map-settings';
import {TabsPage} from '../pages/tabs/tabs';
import {MapFilterPage} from "../pages/map/filter/filter";
import {LocationDetailPage} from "../pages/location/location-details";
import {MyCarsPage} from '../pages/car/my-cars/my-cars';
import {MapDetailPage} from '../pages/location/details-map/map';
import {AddStationImagePage} from '../pages/station/add-image/add-image';
import {SetTariffPage} from '../pages/station/set-tariff/set-tariff';
import {WalletPage} from '../pages/wallet/wallet';
import {AddMoneyPage} from '../pages/wallet/add/add-money';
import {WalletOptionsPage} from '../pages/wallet/options/wallet-options';
import {DashboardPage} from '../pages/dashboard/dashboard';
import {AccountSettingsPage} from '../pages/dashboard/account-settings/account-settings';
import {Ionic2RatingModule} from 'ionic2-rating';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage';
import {AuthService} from "../services/auth.service";
import {CarService} from "../services/car.service";
import {LocationService} from "../services/location.service";
import {UserService} from "../services/user.service";
import {RatingService} from "../services/rating.service";
import {ProfilePage} from '../pages/profile/profile';
import {MyStationsPage} from '../pages/station/my-stations/my-stations';
import {StationMapDetailPage} from '../pages/station/add/station-add-map/map';
import {PlugTypesPage} from '../pages/station/plug-types/plug-types';
import {CarWrapperPage} from "../pages/car/car-wrapper";
import {AddPermissionsPage} from '../pages/station/set-tariff/add-permissions/add-permissions';
import {EditEmailPage} from "../pages/profile/edit-email/edit-email";
import {EditNamePage} from "../pages/profile/edit-name/edit-name";
import {AddRatingPage} from "../pages/rating/add-rating";
import {StationWrapperPage} from "../pages/station/station-wrapper";
import {ChargingPage} from "../pages/location/charging/charging";
import {ChargingCompletePage} from "../pages/location/charging/charging-complete/charging-complete";

let storage = new Storage();

export function getAuthHttp(http) {
    return new AuthHttp(new AuthConfig({
        headerName: 'x-access-token',
        headerPrefix : ' ',
        noJwtError: true,
        globalHeaders: [{'Accept': 'application/json'}, {'Content-Type': 'application/json'}],
        tokenGetter: (() => storage.get('id_token').then((token) => { return token; })),
    }), http);
}

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        MapPage,
        MapFilterPage,
        AutocompletePage,
        SignupPage,
        LoginPage,
        CarWrapperPage,
        CarFormPage,
        AddStationPage,
        CarManufacturerPage,
        CarModelPage,
        MapSettingsPage,
        LocationDetailPage,
        MyCarsPage,
        MapDetailPage,
        AddStationImagePage,
        SetTariffPage,
        WalletPage,
        AddMoneyPage,
        WalletOptionsPage,
        AddRatingPage,
        DashboardPage,
        AccountSettingsPage,
        ProfilePage,
        MyStationsPage,
        PlugTypesPage,
        StationMapDetailPage,
        AddPermissionsPage,
        TabsPage,
        EditEmailPage,
        EditNamePage,
        StationWrapperPage,
        ChargingPage,
        ChargingCompletePage
    ],
    imports: [
        IonicModule.forRoot(MyApp, {
                backButtonText: 'Zurück',
            }, {}
        ),
        Ionic2RatingModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        MapPage,
        MapFilterPage,
        AutocompletePage,
        SignupPage,
        LoginPage,
        CarWrapperPage,
        CarFormPage,
        AddStationPage,
        CarManufacturerPage,
        CarModelPage,
        MapSettingsPage,
        LocationDetailPage,
        MyCarsPage,
        MapDetailPage,
        AddStationImagePage,
        SetTariffPage,
        WalletPage,
        AddMoneyPage,
        WalletOptionsPage,
        AddRatingPage,
        DashboardPage,
        AccountSettingsPage,
        ProfilePage,
        MyStationsPage,
        PlugTypesPage,
        StationMapDetailPage,
        AddPermissionsPage,
        TabsPage,
        EditEmailPage,
        EditNamePage,
        StationWrapperPage,
        ChargingPage,
        ChargingCompletePage
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: getAuthHttp,
            deps: [Http]
        },
        AuthService,
        CarService,
        LocationService,
        UserService,
        Storage,
        RatingService
    ]
})
export class AppModule {
}
