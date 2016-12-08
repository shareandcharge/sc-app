import {Serializable} from './serializable';

export class User implements Serializable<User> {
    id: any;
    email: string;
    firstName: string;
    lastName: string;
    address: string;

    constructor() {
        this.id = '';
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.address = '';
    }

    get displayName() {
        return `${this.firstName} ${this.lastName}`;
    }

    deserialize(input) {
        this.id = input.id;
        this.email = input.email;
        this.firstName = input.firstname;
        this.lastName = input.lastname;
        this.address = input.address;

        return this;
    }
}