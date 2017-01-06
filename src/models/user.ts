import {Serializable} from './serializable';

export class User implements Serializable<User> {
    id: any;
    email: string;
    address: string;
    profile: any;
    cars: any;

    constructor() {
        this.id = '';
        this.email = '';
        this.address = '';
        this.profile = {};
        this.cars = {};
    }

    hasImage() {
        return (typeof this.profile.imageBase64 === "string" && this.profile.imageBase64 !== '');
    }

    get displayImageSrc(): string {
        return this.hasImage() ? this.profile.imageBase64 : 'assets/images/user-default.png';
    }

    get displayName() {
        return `${this.profile.firstName} ${this.profile.lastName}`;
    }

    deserialize(input) {
        this.id = input.id;
        this.email = input.email;
        this.profile = input.profile;
        this.cars = input.cars;
        this.address = input.address;

        return this;
    }
}