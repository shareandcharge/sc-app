import {Serializable} from './serializable';
import {isDefined, isBlank, isArray} from "ionic-angular/util/util";

export class User implements Serializable<User> {
    id: any;
    email: string;
    address: string;
    profile: any;
    cars: any;
    authentification: any;

    constructor() {
        this.id = '';
        this.email = '';
        this.address = '';
        this.profile = {};
        this.cars = {};

        this.authentification = {};

        this.authentification.apnDeviceTokens = [];
        this.authentification.gcmDeviceTokens = [];
    }

    hasImage() {
        return (typeof this.profile.imageBase64 === "string" && this.profile.imageBase64 !== '');
    }

    get displayImageSrc(): string {
        return this.hasImage() ? this.profile.imageBase64 : 'assets/images/user-default.png';
    }

    get displayName() {
        return `${this.profile.firstname} ${this.profile.lastname}`;
    }

    isProfileComplete() {
        let fields = ['firstname', 'lastname', 'address', 'country', 'postalCode', 'city'];
        let allComplete = true;

        fields.forEach(field => {
            let fieldComplete = isDefined(this.profile[field]) && !isBlank(this.profile[field]) && this.profile[field].trim() != '';
            allComplete = allComplete && fieldComplete;
        });

        return allComplete;
    }

    isEmailVerified(): boolean {
        let email = this.email;

        if (!this.authentification.verifiedEmails || !Array.isArray(this.authentification.verifiedEmails) || !email) return false;

        return this.authentification.verifiedEmails.indexOf(email) > -1;
    }

    initTokenArrays() {
        if (!isArray(this.authentification.apnDeviceTokens)) {
            this.authentification.apnDeviceTokens = [];
        }

        if (!isArray(this.authentification.gcmDeviceTokens)) {
            this.authentification.gcmDeviceTokens = [];
        }
    }

    deviceTokenExists(deviceToken) {
        this.initTokenArrays();

        return this.authentification.apnDeviceTokens.indexOf(deviceToken) !== -1
            || this.authentification.gcmDeviceTokens.indexOf(deviceToken) !== -1
    }

    addDeviceToken(deviceToken, platform) {
        this.initTokenArrays();

        if (platform === 'ios') {
            this.authentification.apnDeviceTokens.push(deviceToken);
        }

        if (platform === 'android') {
            this.authentification.gcmDeviceTokens.push(deviceToken);
        }
    }

    deserialize(input) {
        this.id = input.id;
        this.email = input.email;
        this.profile = input.profile;
        this.cars = input.cars;
        this.address = input.address;
        this.authentification = input.authentification;

        return this;
    }
}