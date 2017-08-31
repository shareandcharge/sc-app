import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../models/user";

import 'rxjs/add/operator/map';
import {AuthService} from "./auth.service";
import {AbstractApiService} from "./abstract.api.service";
import {ConfigService} from "./config.service";
import {HttpService} from "./http.service";
import {TranslateService} from "@ngx-translate/core";
import {Events} from "ionic-angular";
import {ErrorService} from "./error.service";

@Injectable()
export class UserService extends AbstractApiService {

    error: string;

    constructor(private authService: AuthService, private httpService: HttpService, configService: ConfigService,
                public translateService: TranslateService, private events: Events, private errorService: ErrorService) {
        super(configService, translateService);
    }

    login(email: string, password: string) {
        let credentials = {'email': email, 'password': password};

        let url = `${this.baseUrl}/users/login`;

        return this.httpService.post(url, JSON.stringify(credentials))
            .map(res => {
                let data = res.json();
                this.authSuccess(data);
            })
            .catch((error) => this.handleError(error));
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
            .catch((error) => this.handleError(error));
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
                let user = result.usr ? result.usr : result.user;

                return new User().deserialize(user)
            })
            .catch((error) => this.handleError(error));
    }

    createUser(signUpObject): Observable<User> {
        return this.httpService.post(`${this.baseUrl}/users`, JSON.stringify(signUpObject))
            .map(res => {
                let data = res.json();
                let user = data.user;

                this.authSuccess(data);
                return new User().deserialize(user);
            })
            .catch((error) => this.handleError(error));
    }

    deleteUser(address?) {
        if (!address) {
            address = this.authService.getUser().address;
        }

        return this.httpService.delete(`${this.baseUrl}/users/${address}`)
            .map(res => res.json())
            .catch((error) => this.handleError(error));
    }

    resetPassword(resetObject) {
        return this.httpService.post(this.baseUrl + '/users/resetPassword', JSON.stringify(resetObject))
            .map(res => res.json())
            .catch((error) => this.handleError(error));
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
            .catch((error) => this.handleError(error));
    }

    /**
     * Use this whenever you change user data (email, profile etc.).
     *
     * This method not only updates the user and the backend but also in the authService and publishes
     * an 'users:updated' event; plus, catches and displays errors.
     * It does _NOT_ call reject for the promise.
     * @param user
     * @param scope
     * @returns {Promise<User>}
     */
    updateUserAndPublish(user: User, scope: string = 'error.scope.update_user'): Promise<User> {
        return new Promise<User>((resolve) => {
            this.updateUser(user)
                .subscribe(
                    () => {
                        this.authService.setUser(user);
                        this.events.publish('users:updated');
                        resolve(user);
                    },
                    error => {
                        this.errorService.displayErrorWithKey(error, scope);
                    }
                );
        });
    }

}
