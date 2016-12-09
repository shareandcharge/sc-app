import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {tokenNotExpired} from 'angular2-jwt';
import {User} from "../models/user";

@Injectable()
export class AuthService {
    TOKEN_NAME = 'id_token';

    storage: Storage;
    user: User;

    constructor() {
        this.storage = new Storage();
        this.user = null;
    }

    loggedIn() {
        // return tokenNotExpired();

        //-- @TODO
        return this.user !== null;
        //
        // this.storage.get('id_token').then(token => {
            // console.log(tokenNotExpired(null, token)); // Returns true/false
        // });
    }

    login(token: string, user: User) {
        this.storage.set(this.TOKEN_NAME, token);
        this.user = user;
    }

    logout() {
        this.storage.remove(this.TOKEN_NAME);
        this.user = null;
    }

    getUser() {
        return this.user;
    }
}