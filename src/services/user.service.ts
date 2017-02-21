import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../models/user";

import 'rxjs/add/operator/map';
import {AuthService} from "./auth.service";
import {AuthHttp} from "angular2-jwt";
import {AbstractApiService} from "./abstract.api.service";

@Injectable()
export class UserService extends AbstractApiService {

    baseUrl: string = 'https://api-test.shareandcharge.com/v1';

    error: string;

    constructor(private authService: AuthService, private authHttp: AuthHttp) {
        super();
    }

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
     * WARNING: query by address is not implemented by the backend, yet
     */
    getUser(address?): Observable<User> {
        let url = address ? `users/${address}` : 'users';
        return this.authHttp.get(`${this.baseUrl}/${url}`)
            .map(res => {
                return new User().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    userExists(email: string) {
        let object = {
            'email': email
        };

        return this.authHttp.post(`${this.baseUrl}/users/exists`, JSON.stringify(object))
            .map(res => res.json());
    }

    updateUser(user: User): Observable<User> {
        return this.authHttp.put(`${this.baseUrl}/users`, JSON.stringify(user))
            .map(res => {
                let result = res.json();
                if (result.token) {
                    this.authService.setToken(result.token);
                }
                return new User().deserialize(result)
            })
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

    deleteUser(address?) {
        if (!address) {
            address = this.authService.getUser().address;
        }

        return this.authHttp.delete(`${this.baseUrl}/users/${address}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    resetPassword(resetObject) {
        return this.authHttp.post(this.baseUrl + '/users/resetPassword', JSON.stringify(resetObject))
            .map(res => res.json())
            .catch(this.handleError);
    }

    resendVerificationEmail(email?) {
        if (!email) {
            email = this.authService.getUser().email;
        }

        let object = {
            'email': email
        };

        return this.authHttp.post(this.baseUrl + '/users/sendVerifyEmail', JSON.stringify(object))
            .map(res => res.json())
            .catch(this.handleError);
    }
}