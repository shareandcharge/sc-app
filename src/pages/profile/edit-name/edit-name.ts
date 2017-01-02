import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {User} from "../../../models/user";
import {ProfilePage} from "../profile";
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
    selector: 'edit-name',
    templateUrl: 'edit-name.html'
})
export class EditNamePage {
    user:User;
    parent:ProfilePage;

    editName:FormGroup;

    constructor(private navParams : NavParams, public navCtrl : NavController, private formBuilder: FormBuilder) {
        this.parent = navParams.get('parent');
        this.user = this.parent.user;

        this.editName = this.formBuilder.group({
            firstName : this.user.firstName,
            lastName : this.user.lastName
        });
    }

    updateUser() {
        this.parent.user.firstName = this.editName.value.firstName;
        this.parent.user.lastName = this.editName.value.lastName;
        this.parent.updateUser();

        this.navCtrl.pop();
    }
}