import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {SignupPage} from '../pages/signup/signup';
import {LoginPage} from '../pages/login/login';
import {MapPage} from '../pages/map/map';
import {AutocompletePage} from '../pages/map/autocomplete/autocomplete';
import {AddStationPage} from '../pages/station/add/add-station';
import {CarManufacturerPage} from '../pages/car/manufacturer/car-manufacturer';
import {CarModelPage} from '../pages/car/model/car-model';
import {MapSettingsPage} from '../pages/map/settings/map-settings';
import {CustomizeCarPage} from '../pages/car/customize/customize-car';
import {TabsPage} from '../pages/tabs/tabs';
import {MapFilterPage} from "../pages/map/filter/filter";
import {LocationDetailPage} from "../pages/location/location-details";
import { MyCarsPage } from '../pages/car/my-cars/my-cars';
import { MapDetailPage } from '../pages/location/details-map/map';
import {AddCarPage} from '../pages/car/add/add-car';
import {AddStationImagePage} from '../pages/station/add-image/add-image';
import {SetTariffPage} from '../pages/station/set-tariff/set-tariff';


@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        MapPage,
        MapFilterPage,
        AutocompletePage,
        SignupPage,
        LoginPage,
        AddCarPage,
        AddStationPage,
        CarManufacturerPage,
        CarModelPage,
        MapSettingsPage,
        CustomizeCarPage,
        LocationDetailPage,
        MyCarsPage,
        MapDetailPage,
        AddStationImagePage,
        SetTariffPage,
        TabsPage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
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
        AddCarPage,
        AddStationPage,
        CarManufacturerPage,
        CarModelPage,
        MapSettingsPage,
        CustomizeCarPage,
        LocationDetailPage,
        MyCarsPage,
        MapDetailPage,
        AddStationImagePage,
        SetTariffPage,
        TabsPage
    ],
    providers: []
})
export class AppModule {
}
