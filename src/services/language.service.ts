import {Injectable} from '@angular/core';
import {ConfigService} from "./config.service";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";

@Injectable()
export class LanguageService {

    STORAGE_KEY_LANGUAGE = 'language';

    defaultLang: string;

    constructor(private configService: ConfigService, private translateService: TranslateService,
                public storage: Storage, private authService: AuthService, private userService: UserService) {
        this.defaultLang = this.configService.getDefaultLanguage();
    }

    /**
     * This is to determine and set the language when the app starts.
     * We "correct" that to the user language when the user refreshes or logs in later.
     */
    initLanguage() {

        this.translateService.setDefaultLang(this.defaultLang);
        let userLang = this.defaultLang;

        this.storage.get(this.STORAGE_KEY_LANGUAGE).then((lang) => {
            if (null === lang) {
                /* language not saved, use navigator */
                userLang = navigator.language.split('-')[0];
            }
            else {
                userLang = lang;
            }

            this.use(userLang);
        });

    }

    /**
     * Always call this instead of the translateService.use
     * @param lang
     */
    use(lang: string) {
        this.translateService.use(lang);
        this.saveLanguage(lang);
    }

    saveLanguage(lang: string): Promise<any> {
        return this.storage.set(this.STORAGE_KEY_LANGUAGE, lang);
    }

    /**
     * Set the language from user. If user does not have a language, set the current
     * and update user.
     */
    setLanguageFromUser() {
        if (!this.authService.loggedIn()) {
            return;
        }

        let user = this.authService.getUser();

        if (user.hasLanguage()) {
            this.use(user.getLanguage());
        }
        else {
            user.setLanguage(this.translateService.currentLang);
            /* we don't want to trigger the user:refresh event here */
            this.userService.updateUserAndPublish(user, undefined, true);
        }
    }
}