import {Component} from "@angular/core";
import {NavParams, NavController, Events} from "ionic-angular";
import {User} from "../../../models/user";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {ErrorService} from "../../../services/error.service";


@Component({
    selector: 'edit-email',
    templateUrl: 'edit-email.html'
})
export class EditEmailPage {
    user: User;

    editEmail: FormGroup;

    constructor(private userService: UserService, private navParams: NavParams, public navCtrl: NavController, private authService: AuthService, private formBuilder: FormBuilder, private events: Events, private errorService: ErrorService) {
        this.user = navParams.get('user');

        this.editEmail = this.formBuilder.group({
            email: this.user.email
        });
    }

    updateUser() {
        this.user.email = this.editEmail.value.email;
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