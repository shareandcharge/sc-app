import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {tokenNotExpired} from 'angular2-jwt';
import {User} from "../models/user";
import {Events, Platform} from "ionic-angular";

@Injectable()
export class AuthService {
    STORAGE_TOKEN_NAME = 'id_token';
    STORAGE_USER_NAME = 'user';

    user: User;
    token: string;

    constructor(private events: Events, private storage: Storage, private platform: Platform) {
        this.user = null;

        //-- storage may not be ready, wait a bit
        platform.ready().then(() => this.checkExistingToken());
    }

    checkExistingToken() {
        this.storage.get(this.STORAGE_TOKEN_NAME).then(token => {
            if (null === token) return;

            this.storage.get(this.STORAGE_USER_NAME).then(user => {
                    if (null === user) return;

                    this.token = token;
                    this.user = new User().deserialize(user);
                    this.events.publish('auth:login');
                }
            );
        });
    }

    loggedIn() {
        return tokenNotExpired(null, this.token);
    }

    login(token: string, user: User) {
        this.storage.set(this.STORAGE_TOKEN_NAME, token).then(() => {
            this.storage.set(this.STORAGE_USER_NAME, user).then(() => {
                this.token = token;
                this.user = user;

                this.events.publish('auth:login');
            });
        });
    }

    logout() {
        this.storage.remove(this.STORAGE_TOKEN_NAME).then(() => {
            this.storage.remove(this.STORAGE_USER_NAME).then(() => {
                this.token = null;
                this.user = null;

                this.events.publish('auth:logout');
            });
        });
    }

    getUser() {
        return this.user;
    }
}