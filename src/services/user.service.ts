import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {AuthService} from './auth.service'
import {Storage} from '@ionic/storage';
import {Observable} from "rxjs";
import {User} from "../models/user";

import 'rxjs/add/operator/map';

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

    getUser(id): Observable<User> {
        return this.http.get(`${this.baseUrl}/users/${id}`)
            .map(res => {
                return new User().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    getUserForEmail(email: string): Observable<User> {
        // this is just a stub
        // TODO: change implementation as soon as backend service is implemented

        let user = new User();
        user.id = 123;
        user.email = "user@user.de";

        return Observable.of(user);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put(`${this.baseUrl}/users/${user.id}`, JSON.stringify(user), {headers: this.contentHeader})
            .map(res => res.json())
            .catch(this.handleError);
    }

    createUser(user: User) {
        return this.http.post(`${this.baseUrl}/users`, JSON.stringify(user), {headers: this.contentHeader})
            .map(res =>  {
                return new User().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    deleteUser(id) {
        return this.http.delete(`${this.baseUrl}/users/${id}`, {headers: this.contentHeader})
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}