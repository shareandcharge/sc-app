import {Serializable} from './serializable';

export class User implements Serializable<User> {
    id: any;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    imageBase64: any;
    profile: any;

    constructor() {
        this.id = '';
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.address = '';
        this.imageBase64 = '';
        this.profile = {};
    }

    hasImage() {
        return (typeof this.imageBase64 === "string" && this.imageBase64 !== '');
    }

    get displayImageSrc(): string {
        return this.hasImage() ? this.imageBase64 : 'assets/images/user-default.png';
    }

    get displayName() {
        return `${this.firstName} ${this.lastName}`;
    }

    deserialize(input) {
        this.id = input.id;
        this.email = input.email;
        this.firstName = input.profile.firstname;
        this.lastName = input.profile.lastname;
        this.address = input.address;

        return this;
    }
}