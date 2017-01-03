import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import {Contacts, Contact} from "ionic-native";
import {User} from "../../../../models/user";
import {UserService} from "../../../../services/user.service";

@Component({
    selector: 'page-add-permissions',
    templateUrl: 'add-permissions.html'
})
export class AddPermissionsPage {
    permissions: any;
    input: any;

    constructor(public navCtrl: NavController, private navParams: NavParams , private viewCtrl: ViewController, public alertCtrl: AlertController, public userService: UserService) {
        this.permissions = navParams.get("permissions");
    }

    ionViewDidLoad() {
    }

    submit() {
        this.addValidEmail(this.input);
    }

    pickFromContacts() {
        Contacts.pickContact().then((contact) => {
            if (typeof contact !== 'undefined') {
                this.addFromContact(contact);
            }
        });
    }

    addUserToPermissionList(email: string) {
        this.permissions.push(email);
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

        this.addFirstValidEmail(contactEmails);
    }

    addValidEmail(emailAddress) {
        this.userService.userExists(emailAddress).subscribe(
            res => {
                if (res.exists) {
                    this.addUserToPermissionList(emailAddress);
                } else {
                    let alert = this.alertCtrl.create({
                        title: 'E-Mail-Adresse nicht registriert',
                        subTitle: 'Die angegebene E-Mail-Adresse ist nicht bei S&C registriert.',
                        buttons: ['Ok']
                    });
                    alert.present();
                }
            }
        );
    }

    addFirstValidEmail(contactEmails) {
        let emailObject = contactEmails.shift();

        if (typeof emailObject === 'undefined') {
            return;
        }

        this.userService.userExists(emailObject.value).subscribe(
            res => {
                if (res.exists) {
                    this.addUserToPermissionList(emailObject.value);
                } else {
                    if (contactEmails.length == 0) {
                        let alert = this.alertCtrl.create({
                            title: 'Keine registrierte E-Mail-Adresse gefunden',
                            subTitle: 'Keiner der gefundenen E-Mail-Adressen ist bei S&C registriert.',
                            buttons: ['Ok']
                        });
                        alert.present();
                    } else {
                        this.addFirstValidEmail(contactEmails);
                    }
                }
            }
        );
    }

    delete(id) {
        this.permissions.splice(this.permissions.findIndex(i => i.id === id), 1);
    }

    dismiss(){
        this.viewCtrl.dismiss(this.permissions);
    }
}
