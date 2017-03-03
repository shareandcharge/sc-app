import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../models/user";

import 'rxjs/add/operator/map';
import {AuthService} from "./auth.service";
import {AbstractApiService} from "./abstract.api.service";
import {ConfigService} from "./config.service";
import {HttpService} from "./http.service";

@Injectable()
export class UserService extends AbstractApiService {

    error: string;

    constructor(private authService: AuthService, private httpService: HttpService, configService: ConfigService) {
        super(configService);
    }

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
     * WARNING: query by address is not implemented by the backend, yet
     */
    getUser(address?): Observable<User> {
        let url = address ? `users/${address}` : 'users';
        return this.httpService.get(`${this.baseUrl}/${url}`)
            .map(res => {
                return new User().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    userExists(email: string) {
        let object = {
            'email': email
        };

        return this.httpService.post(`${this.baseUrl}/users/exists`, JSON.stringify(object))
            .map(res => res.json());
    }

    updateUser(user: User): Observable<User> {
        return this.httpService.put(`${this.baseUrl}/users`, JSON.stringify(user))
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
        return this.httpService.post(`${this.baseUrl}/users`, JSON.stringify(signUpObject))
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

        return this.httpService.delete(`${this.baseUrl}/users/${address}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    resetPassword(resetObject) {
        return this.httpService.post(this.baseUrl + '/users/resetPassword', JSON.stringify(resetObject))
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

        return this.httpService.post(this.baseUrl + '/users/sendVerifyEmail', JSON.stringify(object))
            .map(res => {
                // result may be (completely) empty
                if (res.text()) {
                    res.json()
                }
            })
            .catch(this.handleError);
    }
}