import {Component} from "@angular/core";
import {NavParams, NavController, Events} from "ionic-angular";
import {User} from "../../../models/user";
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {ErrorService} from "../../../services/error.service";


@Component({
    selector: 'edit-email',
    templateUrl: 'edit-email.html'
})
export class EditEmailPage {
    user: User;

    emailForm: any;
    errorMessages: any;
    submitAttempt: boolean = false;

    constructor(private userService: UserService, private navParams: NavParams, public navCtrl: NavController, private authService: AuthService, private formBuilder: FormBuilder, private events: Events, private errorService: ErrorService) {
        this.user = navParams.get('user');

        this.createErrorMessages();

        let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
        this.emailForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.maxLength(225), Validators.minLength(8), Validators.pattern(emailRegex), Validators.required])]
        });
    }

    createErrorMessages() {
        this.errorMessages = {
            "email": 'Bitte gib die E-Mail an.',
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
                    error => this.errorService.displayErrorWithKey(error, 'Benutzer aktualisieren'));
        }
    }
}