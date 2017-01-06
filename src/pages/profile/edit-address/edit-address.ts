import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {User} from "../../../models/user";
import {ProfilePage} from "../profile";
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
    selector: 'edit-address',
    templateUrl: 'edit-address.html'
})
export class EditAddressPage {
    user:User;
    parent:ProfilePage;

    editAddress:FormGroup;

    constructor(private navParams : NavParams, public navCtrl : NavController, private formBuilder: FormBuilder) {
        this.parent = navParams.get('parent');
        this.user = this.parent.user;

        this.editAddress = this.formBuilder.group({
            address : this.user.profile.address,
            city: this.user.profile.city,
            country: this.user.profile.country,
            postalCode: this.user.profile.postalCode
        });
    }

    updateUser() {
        this.parent.user.profile.address = this.editAddress.value.address;
        this.parent.user.profile.city = this.editAddress.value.city;
        this.parent.user.profile.country = this.editAddress.value.country;
        this.parent.user.profile.postalCode = this.editAddress.value.postalCode;

        console.log(this.parent.user);

        this.parent.updateUser();

        this.navCtrl.pop();
    }
}