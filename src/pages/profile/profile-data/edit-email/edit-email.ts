import {Component} from "@angular/core";
import {NavParams, NavController, Events} from "ionic-angular";
import {User} from "../../../../models/user";
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from "../../../../services/user.service";
import {AuthService} from "../../../../services/auth.service";
import {ErrorService} from "../../../../services/error.service";
import {emailValidator} from '../../../../validators/emailValidator';
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'edit-email',
    templateUrl: 'edit-email.html'
})
export class EditEmailPage {
    user: User;

    emailForm: any;
    errorMessages: any;
    submitAttempt: boolean = false;

    constructor(private userService: UserService, private navParams: NavParams, public navCtrl: NavController,
                private authService: AuthService, private formBuilder: FormBuilder, private events: Events,
                private errorService: ErrorService, private translateService: TranslateService) {
        this.user = navParams.get('user');

        this.createErrorMessages();

        this.emailForm = this.formBuilder.group({
            email: ['', Validators.compose([emailValidator.isValid, Validators.maxLength(225)])],
        });
    }

    createErrorMessages() {
        this.errorMessages = {
            "email": this.translateService.instant('profile.data.input_email')
        }
    }

    updateUser() {
        this.submitAttempt = true;
        if (this.emailForm.valid) {
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
}