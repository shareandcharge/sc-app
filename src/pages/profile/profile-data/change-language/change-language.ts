import {Component} from "@angular/core";
import {NavParams, NavController, Events} from "ionic-angular";
import {User} from "../../../../models/user";
import {UserService} from "../../../../services/user.service";
import {AuthService} from "../../../../services/auth.service";
import {ErrorService} from "../../../../services/error.service";
import {ConfigService} from "../../../../services/config.service";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'change-language',
    templateUrl: 'change-language.html'
})
export class ChangeLanguagePage {
    user: User;

    languages: string[];
    selectedLanguage: string;

    constructor(private userService: UserService, private navParams: NavParams, public navCtrl: NavController,
                private authService: AuthService, private events: Events, configService: ConfigService,
                private errorService: ErrorService, private translateService: TranslateService) {
        this.user = navParams.get('user');
        this.selectedLanguage = translateService.currentLang;
        this.languages = configService.getAvailableLanguages();
    }

    ionViewWillLeave() {
        if (this.user.getLanguage() !== this.selectedLanguage) {
            this.user.setLanguage(this.selectedLanguage);
            this.updateUser();
        }
    }

    languageSelected() {
        this.translateService.use(this.selectedLanguage);
    }

    updateUser() {
        this.userService.updateUser(this.user)
            .subscribe(
                () => {
                    this.authService.setUser(this.user);
                    this.events.publish('users:updated');
                    this.navCtrl.pop();
                },
                error => this.errorService.displayErrorWithKey(error, 'error.scope.update_user'));
    }
}