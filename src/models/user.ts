import {Serializable} from './serializable';
import {isDefined, isBlank} from "ionic-angular/util/util";

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