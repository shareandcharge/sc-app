import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {tokenNotExpired} from 'angular2-jwt';
import {User} from "../models/user";
import {Events} from "ionic-angular";

@Injectable()
export class AuthService {
    STORAGE_TOKEN_NAME = 'id_token';

    user: User;
    token: string;

    constructor(private events: Events, private storage: Storage) {
        this.user = null;
    }

    checkExistingToken() {
        this.storage.get(this.STORAGE_TOKEN_NAME).then(token => {
            if (null === token) return;
            this.token = token;
            this.events.publish('auth:refresh:user');
        });
    }

    loggedIn() {
        return tokenNotExpired(null, this.token);
    }

    login(token: string, user: User) {
        this.storage.set(this.STORAGE_TOKEN_NAME, token).then(() => {
            this.token = token;
            this.user = user;

            this.events.publish('auth:login');
        });
    }

    logout() {
        this.storage.remove(this.STORAGE_TOKEN_NAME).then(() => {
            this.token = null;
            this.user = null;

            this.events.publish('auth:logout');
        });
    }

    getUser() {
        return this.user;
    }

    setUser(user: User) {
        this.user = user;
    }
}