import {Injectable} from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {RequestOptionsArgs, Response, RequestOptions, URLSearchParams, Request} from "@angular/http";
import {Observable} from "rxjs";
import * as CryptoJS from 'crypto-js';
import {ConfigService} from "./config.service";

/**
 * We use this class as a wrapper for the jwt httpAuth calls,
 * to generate a jwt token and add it to every request.
 */
@Injectable()
export class HttpService {

    apiKeyConfig: any;

    constructor(private authHttp: AuthHttp, private config: ConfigService) {
        this.apiKeyConfig = config.getApiKey();
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.request(url, this.addToken(options))
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.get(url, this.addToken(options))
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.post(url, body, this.addToken(options));
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.put(url, body, this.addToken(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.delete(url, this.addToken(options));
    }

    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.patch(url, body, this.addToken(options));
    }

    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.head(url, this.addToken(options));
    }

    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authHttp.options(url, this.addToken(options));
    }

    /**
     * Add the apikey/token to (maybe filled) RequestOptions
     * @param requestOptions
     * @returns {any}
     */
    addToken(requestOptions?): RequestOptions {
        let param = this.apiKeyConfig.param;
        let token = this.getToken();

        if (!requestOptions) {
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(param, token);
            requestOptions = new RequestOptions({search: searchParams});
        }
        else if (requestOptions && !requestOptions.search) {
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(param, token);
            requestOptions.search = searchParams;
        }
        else if (requestOptions && requestOptions.search) {
            requestOptions.search.append(param, token);
        }

        return requestOptions;
    }

    getToken(): string {
        let payload = {
            name: this.apiKeyConfig.name,
            iat: Math.floor(Date.now() / 1000)
        };

        return this.JwtEncode(payload, this.apiKeyConfig.secret);
    }

    base64url(source) {
        // Encode in classical base64
        let encodedSource = CryptoJS.enc.Base64.stringify(source);

        return encodedSource.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
    };

    JwtEncode(payload, secret) {
        let header = {
            "alg": "HS256",
            "typ": "JWT"
        };

        let stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));

        let encodedHeader = this.base64url(stringifiedHeader);

        let stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
        let encodedData = this.base64url(stringifiedData);

        let token = encodedHeader + "." + encodedData;

        let signature = CryptoJS.HmacSHA256(token, secret);
        signature = this.base64url(signature);

        return token + "." + signature;
    };
}
