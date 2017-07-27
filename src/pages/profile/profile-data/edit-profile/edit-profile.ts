import {Component} from "@angular/core";
import {NavParams, NavController, Events, AlertController} from "ionic-angular";
import {User} from "../../../../models/user";
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from "../../../../services/user.service";
import {AuthService} from "../../../../services/auth.service";
import {ErrorService} from "../../../../services/error.service";
import {postalCodeValidator} from "../../../../validators/postalCodeValidator";
import {countryValidator} from "../../../../validators/countryValidator";
import {TrackerService} from "../../../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";
import {CurrencyService} from "../../../../services/currency.service";


@Component({
    selector: 'edit-profile',
    templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
    user: User;

    profileForm: any;
    errorMessages: any;
    submitAttempt: boolean = false;
    isPilot: boolean = false;

    constructor(private userService: UserService, private navParams: NavParams, private alertCtrl: AlertController,
                private navCtrl: NavController, private authService: AuthService, private formBuilder: FormBuilder,
                private events: Events, private errorService: ErrorService, private trackerService: TrackerService,
                private translateService: TranslateService, private currencyService: CurrencyService) {

        this.user = navParams.get('user');

        let profile = this.user.profile;

        if (!profile.country) profile.country = 'de';

        this.createErrorMessages();

        this.profileForm = this.formBuilder.group({
            company: [],
            firstName: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(1), Validators.required])],
            lastName: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(1), Validators.required])],
            address: ['', Validators.compose([Validators.maxLength(400), Validators.minLength(2), Validators.required])],
            city: ['', Validators.compose([Validators.maxLength(400), Validators.minLength(2), Validators.required])],
            country: ['', countryValidator.isValid],
            postalCode: ['', Validators.compose([Validators.maxLength(10), Validators.minLength(5), postalCodeValidator.isValid])],
            businessUser: [false],
            taxNumber: [],
            operatorVatID: []
        });

        this.isPilot = this.currencyService.isCommercialOptionHidden();
    }

    createErrorMessages() {
        this.errorMessages = {
            "firstName": this.translateService.instant('error_messages.first_name'),
            "lastName": this.translateService.instant('error_messages.last_name'),
            "address": this.translateService.instant('error_messages.address'),
            "city": this.translateService.instant('error_messages.city'),
            "country": this.translateService.instant('error_messages.country'),
            "postalCode": this.translateService.instant('error_messages.postal_code'),
        }
    }

    updateUser() {
        this.submitAttempt = true;

        if (this.profileForm.valid) {
            this.trackerService.track('Profile saved', {
                'Timestamp': ''
            });

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

    showHelp(field) {
        let message = "";

        switch (field) {
            case 'postalCode':
                message =  this.translateService.instant('error_messages.at_least_5_char');
                break;
            case 'operatorVat':
                message = this.translateService.instant('error_messages.operatorVat');
                break;
        }

        if (message != "") {
            let alert = this.alertCtrl.create({
                title: this.translateService.instant('common.info'),
                message: message,
                buttons: [this.translateService.instant('common.ok')]
            });
            alert.present();
        }
    }
}