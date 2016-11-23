import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {SignupPage} from '../pages/signup/signup';
import {MapPage} from '../pages/map/map';
import {AutocompletePage} from '../pages/map/autocomplete';
import {TabsPage} from '../pages/tabs/tabs';

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        MapPage,
        AutocompletePage,
        SignupPage,
        TabsPage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        MapPage,
        AutocompletePage,
        SignupPage,
        TabsPage
    ],
    providers: []
})
export class AppModule {
}
