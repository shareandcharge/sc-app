import {Component} from "@angular/core";
import {NavParams, NavController, Events} from "ionic-angular";
import {User} from "../../../models/user";
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {ErrorService} from "../../../services/error.service";
import {emailValidator} from '../../../validators/emailValidator'


@Component({
    selector: 'edit-password',
    templateUrl: 'edit-password.html'
})
export class EditPasswordPage {
    user: User;

    passwordForm: any;

    newPassword: any;
    oldPassword: any;

    errorMessages: any;
    submitAttempt: boolean = false;

    constructor(private userService: UserService, private navParams: NavParams, public navCtrl: NavController, private authService: AuthService, private formBuilder: FormBuilder, private events: Events, private errorService: ErrorService) {
        this.user = navParams.get('user');

        console.log(this.user.authentification);

        this.createErrorMessages();

        this.passwordForm = this.formBuilder.group({
            oldPassword: ['', Validators.required],
            newPasswords: this.formBuilder.group({
                password: ['', Validators.compose([Validators.maxLength(225), Validators.minLength(7), Validators.required])],
                passwordRepeat: ['', Validators.compose([Validators.maxLength(225), Validators.minLength(7), Validators.required])]
            }, {validator: this.areEqual})
        });
    }

    areEqual(group) {
        let password = group.controls.password.value;
        let passwordRepeat = group.controls.passwordRepeat.value;

        if (password === passwordRepeat) {
            return null;
        }

        return {
            "not equal" : true
        }
    }

    createErrorMessages() {
        this.errorMessages = {
            "oldPassword": 'Bitte gib dein altes Passwort ein.',
            "newPassword": 'Bitte gib ein neues Passwort ein.',
            "passwordsNotEqual": 'Die Passwörter stimmen nicht überein.'
        }
    }

    updatePassword() {
        this.submitAttempt = true;
        if (this.passwordForm.valid) {
            this.user.authentification.password = this.newPassword;
            this.user.authentification.old_password = this.oldPassword;

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
}