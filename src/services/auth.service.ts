import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
// import {tokenNotExpired} from 'angular2-jwt';
import {User} from "../models/user";
import {Events} from "ionic-angular";

@Injectable()
export class AuthService {
    TOKEN_NAME = 'id_token';

    storage: Storage;
    user: User;

    constructor(private events: Events) {
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
        this.events.publish('auth:login');
    }

    logout() {
        this.storage.remove(this.TOKEN_NAME);
        this.user = null;
        this.events.publish('auth:logout');
    }

    getUser() {
        return this.user;
    }
}