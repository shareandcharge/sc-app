import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {User} from "../../../../models/user";
import {UserService} from "../../../../services/user.service";
import {ConfigService} from "../../../../services/config.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../../../services/auth.service";
import {LanguageService} from "../../../../services/language.service";


@Component({
    selector: 'change-language',
    templateUrl: 'change-language.html'
})
export class ChangeLanguagePage {
    user: User;

    languages: string[];
    selectedLanguage: string;

    constructor(private userService: UserService, public navCtrl: NavController, configService: ConfigService,
                private authService: AuthService, private translateService: TranslateService,
                private languageService: LanguageService) {
        this.user = this.authService.getUser();
        this.selectedLanguage = translateService.currentLang;
        this.languages = configService.getAvailableLanguages();
    }

    ionViewWillLeave() {
        if (this.user.getLanguage() !== this.selectedLanguage) {
            this.user.setLanguage(this.selectedLanguage);
            this.userService.updateUserAndPublish(this.user);
        }
    }

    languageSelected() {
        this.languageService.use(this.selectedLanguage);
    }
}
