import {Component} from "@angular/core";
import {NavParams, NavController, Events} from "ionic-angular";
import {User} from "../../../../models/user";
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from "../../../../services/user.service";
import {AuthService} from "../../../../services/auth.service";
import {ErrorService} from "../../../../services/error.service";
import {TranslateService} from "@ngx-translate/core";


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

    constructor(private userService: UserService, private navParams: NavParams, private navCtrl: NavController,
                private authService: AuthService, private formBuilder: FormBuilder, private events: Events,
                private errorService: ErrorService, private translateService: TranslateService) {
        this.user = navParams.get('user');

        this.createErrorMessages();

        this.passwordForm = this.formBuilder.group({
            oldPassword: [null, Validators.required],
            newPasswords: this.formBuilder.group({
                password: [null, Validators.compose([Validators.maxLength(225), Validators.minLength(10), Validators.required])],
                passwordRepeat: [null, Validators.compose([Validators.maxLength(225), Validators.minLength(10), Validators.required])]
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
            "not equal": true
        }
    }

    createErrorMessages() {
        this.errorMessages = {
            "oldPassword": this.translateService.instant('profile.data.input_old_password'),
            "newPassword": this.translateService.instant('profile.data.input_new_password'),
            "passwordsNotEqual": this.translateService.instant('profile.data.diff_password')
        }
    }

    updatePassword() {
        this.submitAttempt = true;
        if (!this.passwordForm.valid) {
            return;
        }

        this.user.authentification.password = this.newPassword;
        this.user.authentification.old_password = this.oldPassword;

        this.userService.updateUser(this.user)
            .subscribe(
                (user) => {
                    this.authService.setUser(user);
                    this.events.publish('users:updated');
                    this.navCtrl.pop();
                },
                error => this.errorService.displayErrorWithKey(error, 'error.scope.update_user'));

    }
}