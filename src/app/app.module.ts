import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {SignupPage} from '../pages/signup/signup';
import {LoginPage} from '../pages/login/login';
import {MapPage} from '../pages/map/map';
import {AutocompletePage} from '../pages/map/autocomplete';
import {AddCarPage} from '../pages/add-car/add-car';
import {CarManufacturerPage} from '../pages/car-manufacturer/car-manufacturer';
import {CarModelPage} from '../pages/car-model/car-model';
import {MapSettingsPage} from '../pages/map-settings/map-settings';
import {CustomizeCarPage} from '../pages/customize-car/customize-car';
import {TabsPage} from '../pages/tabs/tabs';

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        MapPage,
        AutocompletePage,
        SignupPage,
        LoginPage,
        AddCarPage,
        CarManufacturerPage,
        CarModelPage,
        MapSettingsPage,
        CustomizeCarPage,
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
        AutocompletePage,
        SignupPage,
        LoginPage,
        AddCarPage,
        CarManufacturerPage,
        CarModelPage,
        MapSettingsPage,
        CustomizeCarPage,
        TabsPage
    ],
    providers: []
})
export class AppModule {
}
