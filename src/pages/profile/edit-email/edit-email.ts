import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {User} from "../../../models/user";
import {ProfilePage} from "../profile";
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
    selector: 'edit-email',
    templateUrl: 'edit-email.html'
})
export class EditEmailPage {
    user:User;
    parent:ProfilePage;

    editEmail:FormGroup;

    constructor(private navParams : NavParams, public navCtrl : NavController, private formBuilder: FormBuilder) {
        this.parent = navParams.get('parent');
        this.user = this.parent.user;

        this.editEmail = this.formBuilder.group({
            email : this.user.email
        });
    }

    updateUser() {
        this.parent.user.email = this.editEmail.value.email;
        this.parent.updateUser();

        this.navCtrl.pop();
    }
}