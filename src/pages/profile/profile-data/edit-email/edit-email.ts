import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {User} from "../../../../models/user";
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from "../../../../services/user.service";
import {AuthService} from "../../../../services/auth.service";
import {emailValidator} from '../../../../validators/emailValidator';
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'edit-email',
    templateUrl: 'edit-email.html'
})
export class EditEmailPage {
    user: User;
    editObj: any;

    emailForm: any;
    errorMessages: any;
    submitAttempt: boolean = false;

    constructor(private userService: UserService, public navCtrl: NavController, private authService: AuthService,
                private formBuilder: FormBuilder, private translateService: TranslateService) {
        this.user = this.authService.getUser();
        this.editObj = Object.assign({}, this.user);
        console.log(this.editObj.email);

        this.emailForm = this.formBuilder.group({
            email: ['', Validators.compose([emailValidator.isValid, Validators.maxLength(225)])],
        });

        this.errorMessages = {
            "email": this.translateService.instant('profile.data.input_email')
        }
    }

    updateUser() {
        this.submitAttempt = true;
        if (!this.emailForm.valid) {
            return;
        }

        this.user.email = this.editObj.email;
        this.userService.updateUserAndPublish(this.user).then(() => this.navCtrl.pop());
    }
}