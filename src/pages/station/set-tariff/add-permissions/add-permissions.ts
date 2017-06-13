import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import {Contacts, Contact} from "ionic-native";
import {UserService} from "../../../../services/user.service";
import {ErrorService} from "../../../../services/error.service";
import {TrackerService} from "../../../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'page-add-permissions',
    templateUrl: 'add-permissions.html'
})
export class AddPermissionsPage {
    permissions: any;
    input: any;

    constructor(public navCtrl: NavController, private navParams: NavParams, private viewCtrl: ViewController,
                public alertCtrl: AlertController, public userService: UserService,
                private errorService: ErrorService, private trackerService: TrackerService,
                private translateService: TranslateService) {
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
                title: this.translateService.instant('station.no_main_found'),
                subTitle: this.translateService.instant('station.no_mail_found_msg'),
                buttons: [this.translateService.instant('common.ok')]
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
                        title: this.translateService.instant('station.mail_not_registered'),
                        subTitle: this.translateService.instant('station.mail_not_registered_msg'),
                        buttons: [this.translateService.instant('common.ok')]
                    });
                    alert.present();
                }
            },
            error => this.errorService.displayErrorWithKey(error, 'error.scope.user_exists')
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
                            title: this.translateService.instant('station.registered_mail_not_found'),
                            subTitle: this.translateService.instant('station.registered_mail_not_found_msg'),
                            buttons: [this.translateService.instant('common.ok')]
                        });
                        alert.present();
                    } else {
                        this.addFirstValidEmail(contactEmails);
                    }
                }
            },
            error => this.errorService.displayErrorWithKey(error, 'error.scope.user_exists')
        )
    }

    deleteEmail(deleteEmail) {
        deleteEmail = deleteEmail.toLowerCase();

        let alert = this.alertCtrl.create({
            title: this.translateService.instant('station.confirm_delete'),
            message: this.translateService.instant('station.msg_confirm_delete_addr'),
            buttons: [
                {
                    text: this.translateService.instant('common.cancel'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('station.yes_delete'),
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
