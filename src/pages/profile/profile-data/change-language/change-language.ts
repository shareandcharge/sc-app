import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {User} from "../../../../models/user";
import {UserService} from "../../../../services/user.service";
import {ConfigService} from "../../../../services/config.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../../../services/auth.service";


@Component({
    selector: 'change-language',
    templateUrl: 'change-language.html'
})
export class ChangeLanguagePage {
    user: User;

    languages: string[];
    selectedLanguage: string;

    constructor(private userService: UserService, public navCtrl: NavController, configService: ConfigService,
                private authService: AuthService, private translateService: TranslateService) {
        this.user = this.authService.getUser();
        this.selectedLanguage = translateService.currentLang;
        this.languages = configService.getAvailableLanguages();
    }

    ionViewWillLeave() {
        if (this.user.getLanguage() !== this.selectedLanguage) {
            this.user.setLanguage(this.selectedLanguage);
            this.userService.updateUserAndPublish(this.user).then();
        }
    }

    languageSelected() {
        this.translateService.use(this.selectedLanguage);
    }
}
