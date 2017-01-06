import {Component} from "@angular/core";
import {NavParams, NavController, AlertController, Events} from "ionic-angular";
import {User} from "../../../models/user";
import {ProfilePage} from "../profile";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";


@Component({
    selector: 'edit-address',
    templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
    user: User;
    parent: ProfilePage;

    editAddress: FormGroup;

    constructor(private alertCtrl: AlertController, private userService: UserService, private navParams: NavParams, public navCtrl: NavController, private authService: AuthService, private formBuilder: FormBuilder, private events: Events) {
        this.user = navParams.get('user');

        this.editAddress = this.formBuilder.group({
            firstName: this.user.profile.firstName,
            lastName: this.user.profile.lastName,
            address: this.user.profile.address,
            city: this.user.profile.city,
            country: this.user.profile.country,
            postalCode: this.user.profile.postalCode
        });
    }

    updateUser() {
        this.user.profile.firstName = this.editAddress.value.firstName;
        this.user.profile.lastName = this.editAddress.value.lastName;
        this.user.profile.address = this.editAddress.value.address;
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
                error => this.displayError(<any>error, 'Benutzer aktualisieren'));
    }

    displayError(message: any, subtitle?: string) {
        let alert = this.alertCtrl.create({
            title: 'Fehler',
            subTitle: subtitle,
            message: message,
            buttons: ['Schließen']
        });
        alert.present();
    }

}