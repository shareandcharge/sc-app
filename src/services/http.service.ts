import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable()
export class HttpService {
    constructor(private http: Http, private authService: AuthService) {}

    createHeaders(): Promise<Headers> {
        let headers = new Headers({"Content-Type": "application/json"});

        return this.authService.getToken().then((token) => {
            if (token !== null) {
                headers.append('x-access-token', token);
            }

            return headers;
        });
    }

    get(url): Observable<Response> {
        return Observable
            .fromPromise(this.createHeaders())
            .switchMap((headers) => {
                return this.http.get(url, {headers: headers})
            });
    }

    post(url, data): Observable<Response> {
        return Observable
            .fromPromise(this.createHeaders())
            .switchMap((headers) => {
                return this.http.post(url, data, {headers: headers})
            });
    }

    put(url, data): Observable<Response> {
        return Observable
            .fromPromise(this.createHeaders())
            .switchMap((headers) => {
                return this.http.put(url, data, {headers: headers})
            });
    }

    delete(url): Observable<Response> {
        return Observable
            .fromPromise(this.createHeaders())
            .switchMap((headers) => {
                return this.http.delete(url, {headers: headers})
            });
    }
}