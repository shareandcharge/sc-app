import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import {Contacts, Contact} from "ionic-native";
import {UserService} from "../../../../services/user.service";
import {ErrorService} from "../../../../services/error.service";
import {TrackerService} from "../../../../services/tracker.service";

@Component({
    selector: 'page-add-permissions',
    templateUrl: 'add-permissions.html'
})
export class AddPermissionsPage {
    permissions: any;
    input: any;

    constructor(public navCtrl: NavController, private navParams: NavParams, private viewCtrl: ViewController,
                public alertCtrl: AlertController, public userService: UserService,
                private errorService: ErrorService, private trackerService: TrackerService) {
        this.permissions = navParams.get("permissions");
    }

    ionViewDidEnter() {
        this.trackerService.track('Started Adding Friends', {});
    }

    submitEmail() {
        if (!this.input) return;
        this.input = this.input.toLowerCase();
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
        this.trackerService.track('Added Friends', {});

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
            },
            error => this.errorService.displayErrorWithKey(error, 'Benutzerabfrage')
        )
    }

    addFirstValidEmail(contactEmails) {
        let emailObject = contactEmails.shift();

        if (typeof emailObject === 'undefined') {
            return;
        }

        this.userService.userExists(emailObject.value).subscribe(
            res => {
                if (res.exists) {
                    this.addUserToPermissionList(emailObject.value.toLowerCase());
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
            },
            error => this.errorService.displayErrorWithKey(error, 'Benutzerabfrage')
        )
    }

    deleteEmail(deleteEmail) {
        deleteEmail = deleteEmail.toLowerCase();

        let alert = this.alertCtrl.create({
            title: 'Löschen bestätigen',
            message: 'Möchtest Du dieses E-Mail Adresse aus dem Tarif entfernen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel'
                },
                {
                    text: 'Ja, löschen',
                    handler: () => {
                        this.permissions.splice(this.permissions.findIndex(email => deleteEmail === email.toLowerCase()), 1);
                    }
                }
            ]
        });
        alert.present();
    }

    dismiss() {
        this.viewCtrl.dismiss(this.permissions);
    }
}
