import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import {Contacts, Contact} from "ionic-native";
import {User} from "../../../../models/user";

@Component({
    selector: 'page-add-permissions',
    templateUrl: 'add-permissions.html'
})
export class AddPermissionsPage {
    permissions: any;
    input: any;

    constructor(public navCtrl: NavController, private navParams: NavParams , private viewCtrl: ViewController, public alertCtrl: AlertController) {
        this.permissions = navParams.get("permissions");
    }

    ionViewDidLoad() {
    }

    submit() {
        let user = this.getUserForEmail(this.input);

        if (user != null) {
            this.addUserToPermissionList(user);
        } else {
            let alert = this.alertCtrl.create({
                title: 'E-Mail-Adresse nicht registriert',
                subTitle: 'Die angegebene E-Mail-Adresse ist nicht bei S&C registriert.',
                buttons: ['Ok']
            });
            alert.present();
        }
    }

    pickFromContacts() {
        Contacts.pickContact().then((contact) => {
            if (typeof contact !== 'undefined') {
                this.addFromContact(contact);
            }
        });
    }

    addUserToPermissionList(user: User) {
        let index = 1;
        if (this.permissions.length > 0) {
            index = parseInt(this.permissions[this.permissions.length - 1].id) + 1;
        }

        let permission = {
            "id": index,
            "userId": user.id,
            "email" : user.email
        };

        this.permissions.push(permission);
        this.input = "";
    }

    addFromContact(contact: Contact) {
        let contactEmails = contact.emails;

        if (contactEmails == null) {
            let alert = this.alertCtrl.create({
                title: 'Keine E-Mail-Adressen gefunden',
                subTitle: 'Bitte wähle einen Kontakt mit mindestens einer E-Mail-Adresse aus.',
                buttons: ['Ok']
            });
            alert.present();
            return;
        }

        for (let emailObject of contactEmails) {
            let user = this.getUserForEmail(emailObject.value);

            if (user != null) {
                this.addUserToPermissionList(user);
                return
            }
        }

        // none of the found addresses is registered in the app

        let alert = this.alertCtrl.create({
            title: 'Keine registrierte E-Mail-Adresse gefunden',
            subTitle: 'Keiner der gefundenen E-Mail-Adressen ist bei S&C registriert.',
            buttons: ['Ok']
        });
        alert.present();

    }

    getUserForEmail(emailAddress: string): User {
        // dummy data until the service is implemented

        let user = new User();
        user.id = 123;
        user.email = "lorem@ipsum.de";

        return user;
    }

    delete(id) {
        this.permissions.splice(this.permissions.findIndex(i => i.id === id), 1);
    }

    dismiss(){
        this.viewCtrl.dismiss(this.permissions);
    }
}
