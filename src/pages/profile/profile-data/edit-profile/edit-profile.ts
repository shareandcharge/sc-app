import {Component} from "@angular/core";
import {NavParams, NavController, Events, AlertController} from "ionic-angular";
import {User} from "../../../../models/user";
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {UserService} from "../../../../services/user.service";
import {AuthService} from "../../../../services/auth.service";
import {ErrorService} from "../../../../services/error.service";
import {postalCodeValidator} from "../../../../validators/postalCodeValidator";
import {countryValidator} from "../../../../validators/countryValidator";
import {TrackerService} from "../../../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";
import {CurrencyService} from "../../../../services/currency.service";
import {isString} from "ionic-angular/util/util";


@Component({
    selector: 'edit-profile',
    templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
    user: User;

    profileForm: any;
    errorMessages: any;
    submitAttempt: boolean = false;

    countries: any = [
        {
            'value': 'de',
            'name': '',
            'selected' : true
        },
        {
            'value': 'us',
            'name': '',
            'selected' : false
        },
        {
            'value': 'nl',
            'name': '',
            'selected' : false
        }
    ];

    isPilot: boolean = false;


    constructor(private userService: UserService, private navParams: NavParams, private alertCtrl: AlertController,
                private navCtrl: NavController, private authService: AuthService, private formBuilder: FormBuilder,
                private events: Events, private errorService: ErrorService, private trackerService: TrackerService,
                private translateService: TranslateService, private currencyService: CurrencyService) {

        this.user = navParams.get('user');

        let profile = this.user.profile;

        if (!profile.country) profile.country = 'de';

        this.createErrorMessages();

        // This is a workaround because using the translation pipe in the option tag breaks the select, see https://github.com/ionic-team/ionic/issues/8561
        this.countries.forEach((country) => {
            country.name = this.translateService.instant('profile.country.' + country.value);
        });

        this.isPilot = this.currencyService.isCommercialOptionHidden();

        this.profileForm = this.formBuilder.group({
            company: [],
            firstName: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(1), Validators.required])],
            lastName: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(1), Validators.required])],
            address: ['', Validators.compose([Validators.maxLength(400), Validators.minLength(2), Validators.required])],
            city: ['', Validators.compose([Validators.maxLength(400), Validators.minLength(2), Validators.required])],
            state: ['', Validators.compose([Validators.maxLength(400), Validators.minLength(2)])],
            country: ['', countryValidator.isValid],
            postalCode: ['', Validators.compose([Validators.maxLength(10), Validators.minLength(5), postalCodeValidator.isValid])],
            businessUser: [false],
            operatorVatID: []
        }, {
            validator: this.isPilot ? null : this.validateBusinessUser.bind(this)
        });

    }

    validateBusinessUser(group: FormGroup) {
        if (!group.value.businessUser) {
            return null;
        }
        let error:any = {};

        if (!isString(group.value.company) || group.value.company.length < 1) {
            error.company = true;
        }
        if (!isString(group.value.operatorVatID) || group.value.operatorVatID.length < 1) {
            error.vatNumber = true;
        }

        return Object.keys(error).length > 0 ? {businessUser: error} : null;
    }

    createErrorMessages() {
        this.errorMessages = {
            "firstName": this.translateService.instant('error_messages.first_name'),
            "lastName": this.translateService.instant('error_messages.last_name'),
            "address": this.translateService.instant('error_messages.address'),
            "city": this.translateService.instant('error_messages.city'),
            "state": this.translateService.instant('error_messages.state'),
            "country": this.translateService.instant('error_messages.country'),
            "postalCode": this.translateService.instant('error_messages.postal_code'),
            "vatNumber": this.translateService.instant('error_messages.vat_number'),
            "company": this.translateService.instant('error_messages.company'),
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