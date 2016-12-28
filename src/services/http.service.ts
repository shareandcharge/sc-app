import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable()
export class HttpService {
    constructor(private http: Http, private authService: AuthService) {}

    createHeaders() : Promise<Headers> {
        let headers = new Headers({"Content-Type": "application/json"});

        return this.authService.getToken().then((token) => {
            headers.append('x-access-token', token);
        });
    }

    get(url) : Observable<any> {
        return Observable
            .fromPromise(this.createHeaders())
            .map((headers) => {
                this.http.get(url, {headers: headers})
            });
    }
}