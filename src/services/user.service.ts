import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AuthService} from './auth.service'
import {Storage} from '@ionic/storage';
import {User} from "../models/user";

@Injectable()
export class UserService {

    baseUrl: string = 'http://5834821b62f23712003730c0.mockapi.io/api/v1';

    contentHeader: Headers = new Headers({"Content-Type": "application/json"});
    storage: Storage = new Storage();

    error: string;

    constructor(private http: Http, private auth: AuthService) {
    }

    login(email: string, password: string) {
        let credentials = {'email': email, 'password': password};

        // let url = `${this.baseUrl}/users/login`;
        let url = `${this.baseUrl}/users`;

        return this.http.post(url, JSON.stringify(credentials), {headers: this.contentHeader})
            .map(res => {
                let data = res.json();
                this.authSuccess(data);

                // @TODO we need the delete for the mockup api; remove later.
                let id = data.id;
                this.http.delete(`${this.baseUrl}/users/${id}`, {headers: this.contentHeader})
                    .map(res => res.json())
                    .subscribe(() => {
                    });

            });
    }

    authSuccess(data) {
        // console.log('LOGIN SUCCESS:', data);
        this.error = null;
        let token = data.token;
        let user = new User().deserialize(data.user);
        this.auth.login(token, user);
    }
}