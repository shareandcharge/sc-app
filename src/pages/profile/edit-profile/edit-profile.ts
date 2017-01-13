import {Component} from "@angular/core";
import {NavParams, NavController, Events, AlertController} from "ionic-angular";
import {User} from "../../../models/user";
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {ErrorService} from "../../../services/error.service";
import {postalCodeValidator} from "../../../validators/postalCodeValidator";
import {countryValidator} from "../../../validators/countryValidator";


@Component({
    selector: 'edit-address',
    templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
    user: User;

    profileForm: any;
    errorMessages: any;
    submitAttempt: boolean = false;

    constructor(private userService: UserService, private navParams: NavParams, public alertCtrl: AlertController, public navCtrl: NavController, private authService: AuthService, private formBuilder: FormBuilder, private events: Events, private errorService: ErrorService) {
        this.user = navParams.get('user');

        let profile = this.user.profile;

        if (!profile.country) profile.country = 'de';

        this.createErrorMessages();

        this.profileForm = this.formBuilder.group({
            firstName: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            lastName: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            address: ['', Validators.compose([Validators.maxLength(400), Validators.minLength(2), Validators.required])],
            city: ['', Validators.compose([Validators.maxLength(400), Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            country: ['', countryValidator.isValid],
            postalCode: ['', Validators.compose([Validators.maxLength(10), Validators.minLength(5), postalCodeValidator.isValid])]
        });
    }

    createErrorMessages() {
        this.errorMessages = {
            "firstName": 'Bitte gib die Name an.',
            "lastName": 'Bitte gib die Nachname an.',
            "address": 'Bitte gib die Adresse an',
            "city": 'Bitte gib die Stadt an',
            "country": 'Bitte gib der Land an.',
            "postalCode": 'Bitte gib die PLZ an.'
        }
    }

    updateUser() {
        this.submitAttempt = true;

        if (this.profileForm.valid) {
            this.userService.updateUser(this.user)
                .subscribe(
                    () => {
                        this.authService.setUser(this.user);
                        this.events.publish('users:updated');
                        this.navCtrl.pop();
                    },
                    error => this.errorService.displayErrorWithKey(error, 'Benutzer aktualisieren'));
        }
    }

    showHelp(field) {
        let message = "";

        switch (field) {
            case 'postalCode':
                message = "must be between 5 to 10 digits";
                break;
        }

        if (message != "") {
            let alert = this.alertCtrl.create({
                title: 'Info',
                message: message,
                buttons: ['Ok']
            });
            alert.present();
        }
    }
}