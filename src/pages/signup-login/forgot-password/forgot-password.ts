import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
import {UserService} from "../../../services/user.service";

@Component({
    selector: 'forgot-password',
    templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
    email: string;

    constructor(private viewCtrl: ViewController, private userService: UserService) {

    }

    submitEmail() {
        let resetObject = {
            "email" : this.email
        };

        this.userService.resetPassword(resetObject).subscribe((res) => {
            console.log(res);
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
