import {Injectable} from '@angular/core';
import {Response, Http} from '@angular/http';
import {Storage} from '@ionic/storage';
import {Observable} from "rxjs";
import {User} from "../models/user";

import 'rxjs/add/operator/map';
import {AuthService} from "./auth.service";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class UserService {

    baseUrl: string = 'https://api-test.shareandcharge.com/v1';

    storage: Storage = new Storage();

    error: string;

    constructor(private authService: AuthService, private authHttp: AuthHttp) {}

    login(email: string, password: string) {
        let credentials = {'email': email, 'password': password};

        let url = `${this.baseUrl}/users/login`;

        return this.authHttp.post(url, JSON.stringify(credentials))
            .map(res => {
                let data = res.json();
                this.authSuccess(data);
            })
            .catch(this.handleError);
    }

    authSuccess(data) {
        this.error = null;
        let token = data.token;
        let user = new User().deserialize(data.user);
        this.authService.login(token, user);
    }

    /*
     * WARNING: not implemented by the backend
     */
    getUser(id): Observable<User> {
        return this.authHttp.get(`${this.baseUrl}/users/${id}`)
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
        user.profile.firstname = user.firstName;
        user.profile.lastname = user.lastName;

        return this.authHttp.put(`${this.baseUrl}/users`, JSON.stringify(user))
            .map(res => res.json())
            .catch(this.handleError);
    }

    createUser(signUpObject) {
        return this.authHttp.post(`${this.baseUrl}/users`, JSON.stringify(signUpObject))
            .map(res =>  {
                let data = res.json();

                this.authSuccess(data);
                return new User().deserialize(data);
            })
            .catch(this.handleError);
    }

    /*
     * WARNING: not implemented by the backend
     */
    deleteUser(id) {
        return this.authHttp.delete(`${this.baseUrl}/users/${id}`)
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