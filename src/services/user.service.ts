import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Storage} from '@ionic/storage';
import {Observable} from "rxjs";
import {User} from "../models/user";

import 'rxjs/add/operator/map';
import {HttpService} from "./http.service";
import {AuthService} from "./auth.service";

@Injectable()
export class UserService {

    baseUrl: string = 'https://api-test.shareandcharge.com/v1';

    storage: Storage = new Storage();

    error: string;

    constructor(private httpService: HttpService, private authService: AuthService) {}

    login(email: string, password: string) {
        let credentials = {'email': email, 'password': password};

        let url = `${this.baseUrl}/users/login`;

        return this.httpService.post(url, JSON.stringify(credentials))
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
        return this.httpService.get(`${this.baseUrl}/users/${id}`)
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
        return this.httpService.put(`${this.baseUrl}/users`, JSON.stringify(user))
            .map(res => res.json())
            .catch(this.handleError);
    }

    createUser(user: User) {
        return this.httpService.post(`${this.baseUrl}/users`, JSON.stringify(user))
            .map(res =>  {
                return new User().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    /*
     * WARNING: not implemented by the backend
     */
    deleteUser(id) {
        return this.httpService.delete(`${this.baseUrl}/users/${id}`)
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