import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage';
import {NgModule, LOCALE_ID} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';

import {IntroPage} from "../pages/intro/intro";
import {AboutPage} from '../pages/about/about';
import {SignupLoginPage} from '../pages/signup-login/signup-login';
import {MapPage} from '../pages/map/map';
import {AddStationPage} from '../pages/station/add/add-station';
import {CarManufacturerPage} from '../pages/car/form/manufacturer/car-manufacturer';
import {CarModelPage} from '../pages/car/form/model/car-model';
import {CarFormPage} from '../pages/car/form/car-form';
import {MapSettingsPage} from '../pages/map/settings/map-settings';
import {TabsPage} from '../pages/tabs/tabs';
import {FilterWrapperPage} from "../pages/map/filter/filter-wrapper";
import {FilterSelectPage} from "../pages/map/filter/filter-select";
import {FilterCommercialCategoryPage} from "../pages/map/filter/filter-commercial-category";
import {FilterPlugtypesPage} from "../pages/map/filter/filter-plugtypes";
import {LocationDetailPage} from "../pages/location/location-details";
import {MyCarsPage} from '../pages/car/my-cars/my-cars';
import {MapDetailPage} from '../pages/location/details-map/map';
import {AddStationImagePage} from '../pages/station/add-image/add-image';
import {SetTariffPage} from '../pages/station/set-tariff/set-tariff';
import {WalletPage} from '../pages/wallet/wallet';
import {AddMoneyPage} from '../pages/wallet/add/add-money';
import {ProfilePage} from '../pages/profile/profile';
import {HelpPage} from '../pages/help/help';
import {AccountSettingsPage} from '../pages/profile/account-settings/account-settings';
import {EditProfilePage} from "../pages/profile/profile-data/edit-profile/edit-profile";
import {ProfileDataPage} from '../pages/profile/profile-data/profile-data';
import {NotificationsPage} from '../pages/profile/notifications/notifications';
import {MyStationsPage} from '../pages/station/my-stations/my-stations';
import {StationMapDetailPage} from '../pages/station/add/station-add-map/map';
import {PlugTypesPage} from '../pages/station/plug-types/plug-types';
import {CarWrapperPage} from "../pages/car/car-wrapper";
import {AddPermissionsPage} from '../pages/station/set-tariff/add-permissions/add-permissions';
import {EditEmailPage} from "../pages/profile/profile-data/edit-email/edit-email";
import {ChangeLanguagePage} from "../pages/profile/profile-data/change-language/change-language";
import {AddRatingPage} from "../pages/rating/add-rating";
import {StationWrapperPage} from "../pages/station/station-wrapper";
import {ChargingPage} from "../pages/location/charging/charging";
import {ChargingCompletePage} from "../pages/location/charging/charging-complete/charging-complete";
import {TransactionDetailPage} from "../pages/wallet/transaction-detail/transaction-detail";
import {EditPasswordPage} from "../pages/profile/profile-data/edit-password/edit-password";
import {ForgotPasswordPage} from "../pages/signup-login/forgot-password/forgot-password";
import {TariffConfirmationPage} from "../pages/station/set-tariff/tariff-confirmation/tariff-confirmation";
import {PayOutPage} from "../pages/wallet/pay-out/pay-out";
import {VoucherPage} from "../pages/wallet/voucher/voucher";
import {DataProtectionPage} from "../pages/_global/data-protection/data-protection";

import {ChargingProgressBarComponent} from '../components/charging-progress-bar/charging-progress-bar'
import {ProgressBarComponent} from '../components/progress-bar/progress-bar';
import {CurrencyDisplay} from '../models/currency-display';

import {Ionic2RatingModule} from 'ionic2-rating';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AuthService} from "../services/auth.service";
import {CarService} from "../services/car.service";
import {LocationService} from "../services/location.service";
import {UserService} from "../services/user.service";
import {RatingService} from "../services/rating.service";
import {PaymentService} from "../services/payment.service";
import {ChargingService} from "../services/charging.service";
import {ConfigService} from "../services/config.service";
import {ErrorService} from "../services/error.service";
import {HttpService} from "../services/http.service";
import {PushNotificationService} from "../services/push.notification.service";
import {TrackerService} from "../services/tracker.service";
import {CurrencyService} from "../services/currency.service";
import {LanguageService} from "../services/language.service";
import {JuiceBoxPage} from "../pages/station/juice-box/juice-box";
import {InfoService} from "../services/info.service";
import {EventService} from '../services/event.service';

let storage = new Storage();

export function getAuthHttp(http) {
    return new AuthHttp(new AuthConfig({
        headerName: 'x-access-token',
        headerPrefix: ' ',
        noJwtError: true,
        globalHeaders: [{'Accept': 'application/json'}, {'Content-Type': 'application/json'}],
        tokenGetter: (() => storage.get('id_token').then((token) => {
            return token;
        })),
    }), http);
}

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        DataProtectionPage,
        MapPage,
        FilterWrapperPage,
        FilterSelectPage,
        FilterCommercialCategoryPage,
        FilterPlugtypesPage,
        SignupLoginPage,
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
        AddRatingPage,
        ProfilePage,
        HelpPage,
        AccountSettingsPage,
        ProfileDataPage,
        NotificationsPage,
        MyStationsPage,
        PlugTypesPage,
        StationMapDetailPage,
        AddPermissionsPage,
        TabsPage,
        EditEmailPage,
        ChangeLanguagePage,
        StationWrapperPage,
        ChargingPage,
        ChargingCompletePage,
        ProgressBarComponent,
        ChargingProgressBarComponent,
        IntroPage,
        EditProfilePage,
        TransactionDetailPage,
        EditPasswordPage,
        ForgotPasswordPage,
        TariffConfirmationPage,
        PayOutPage,
        VoucherPage,
        CurrencyDisplay,
        JuiceBoxPage
    ],
    imports: [
        IonicModule.forRoot(MyApp, {
                backButtonText: '',
            }, {}
        ),
        Ionic2RatingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        DataProtectionPage,
        MapPage,
        FilterWrapperPage,
        FilterSelectPage,
        FilterCommercialCategoryPage,
        FilterPlugtypesPage,
        SignupLoginPage,
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
        AddRatingPage,
        ProfilePage,
        HelpPage,
        AccountSettingsPage,
        ProfileDataPage,
        NotificationsPage,
        MyStationsPage,
        PlugTypesPage,
        StationMapDetailPage,
        AddPermissionsPage,
        TabsPage,
        EditEmailPage,
        ChangeLanguagePage,
        StationWrapperPage,
        ChargingPage,
        ChargingCompletePage,
        IntroPage,
        EditProfilePage,
        TransactionDetailPage,
        EditPasswordPage,
        ForgotPasswordPage,
        TariffConfirmationPage,
        PayOutPage,
        VoucherPage,
        JuiceBoxPage
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: getAuthHttp,
            deps: [Http]
        },
        {
            provide: LOCALE_ID,
            useValue: "de-DE"
            //deps: [SettingsService],      //some service handling global settings
            //useFactory: (settingsService) => settingsService.getLanguage()  //returns locale string
        },
        AuthService,
        CarService,
        LocationService,
        UserService,
        Storage,
        RatingService,
        PaymentService,
        ChargingService,
        PaymentService,
        ConfigService,
        ErrorService,
        HttpService,
        PushNotificationService,
        TrackerService,
        CurrencyService,
        LanguageService,
        InfoService,
        EventService
    ]
})
export class AppModule {
}
