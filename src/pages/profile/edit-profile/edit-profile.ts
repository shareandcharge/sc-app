import {Component} from "@angular/core";
import {NavParams, NavController, Events} from "ionic-angular";
import {User} from "../../../models/user";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";
import {ErrorService} from "../../../services/error.service";


@Component({
    selector: 'edit-address',
    templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
    user: User;

    editAddress: FormGroup;

    constructor(private userService: UserService, private navParams: NavParams, public navCtrl: NavController, private authService: AuthService, private formBuilder: FormBuilder, private events: Events, private errorService: ErrorService) {
        this.user = navParams.get('user');

        let profile = this.user.profile;

        if (!profile.country) profile.country = 'de';

        this.editAddress = this.formBuilder.group({
            firstname: profile.firstname,
            lastname: profile.lastname,
            address: profile.address,
            city: profile.city,
            country: profile.country,
            postalCode: profile.postalCode
        });
    }

    updateUser() {
        this.user.profile.firstname = this.editAddress.value.firstname;
        this.user.profile.lastname = this.editAddress.value.lastname;
        this.user.profile.address = this.editAddress.value.address;
        this.user.profile.city = this.editAddress.value.city;
        this.user.profile.country = this.editAddress.value.country;
        this.user.profile.postalCode = this.editAddress.value.postalCode;

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