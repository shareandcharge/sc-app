import {Component} from '@angular/core';
import {NavController, NavParams , ViewController} from 'ionic-angular';

@Component({
    selector: 'page-add-permissions',
    templateUrl: 'add-permissions.html'
})
export class AddPermissionsPage {
    permissions: any;
    input: any;

    constructor(public navCtrl: NavController, private navParams: NavParams , private viewCtrl: ViewController) {
        this.permissions = navParams.get("permissions");
    }

    ionViewDidLoad() {
    }

    submit() {
        let index = 1;
        if (this.permissions.length > 0) {
            index = parseInt(this.permissions[this.permissions.length - 1].id) + 1;
        }

        let permission = {
            "id": index,
            "text": this.input
        };
        this.permissions.push(permission);
        this.input = "";
    }

    delete(id) {
        this.permissions.splice(this.permissions.findIndex(i => i.id === id), 1);
    }

    dismiss(){
        this.viewCtrl.dismiss(this.permissions);
    }
}
