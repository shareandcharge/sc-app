import {Component} from "@angular/core";
import {ViewController, AlertController} from "ionic-angular";
import {UserService} from "../../../services/user.service";
import {ErrorService} from "../../../services/error.service";
import {FormBuilder, Validators} from "@angular/forms";
import {emailValidator} from "../../../validators/emailValidator";

@Component({
    selector: 'forgot-password',
    templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
    email: string;
    forgotForm: any;
    submitAttempt: boolean = false;

    constructor(private viewCtrl: ViewController, private userService: UserService, private errorService: ErrorService, private formBuilder: FormBuilder, private alertCtrl: AlertController) {
        this.forgotForm = formBuilder.group({
            email: ['', Validators.compose([emailValidator.isValid, Validators.maxLength(225)])]
        });
    }

    submitEmail() {
        this.submitAttempt = true;

        if (!this.forgotForm.valid) {
            return;
        }

        let resetObject = {
            "email": this.email
        };

        let me = this;
        this.userService.resetPassword(resetObject).subscribe(
            () => {
                let alert = this.alertCtrl.create({
                    title: 'Passwort vergessen',
                    message: 'Wir haben Dir eine E-Mail geschickt, um Dein Passwort zurückzusetzen!',
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            me.dismiss();
                        }
                    }]

                });
                alert.present();
            },
            error => {
                this.errorService.displayErrorWithKey(error, 'Passwort vergessen')
            }
        );
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
