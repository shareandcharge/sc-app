import {Injectable} from "@angular/core";
import {Headers} from "@angular/http";
import {Observable} from "rxjs";
import {Rating} from "../models/rating";
import {AbstractApiService} from "./abstract.api.service";
import {ConfigService} from "./config.service";
import {HttpService} from "./http.service";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class RatingService extends AbstractApiService {
    private contentHeader: Headers = new Headers({"Content-Type": "application/json"});

    constructor(private httpService: HttpService, configService: ConfigService, 
                public translateService: TranslateService) {
        super(configService, translateService);
        this.baseUrl += '/locations/';
    }

    getRatings(locationId: number): Observable<Array<Rating>> {
        return this.httpService.get(this.baseUrl + locationId + '/ratings')
            .map(res => {
                let ratings = [];
                res.json().forEach(input => {
                    ratings.push(new Rating().deserialize(input));
                });

                return ratings;
            })
            .catch((error) => this.handleError(error));
    }

    getRating(locationId: number, ratingId: number): Observable<Rating> {
        return this.httpService.get(this.baseUrl + locationId + '/ratings/' + ratingId)
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch((error) => this.handleError(error));
    }

    createRating(locationId: number, rating: Rating): Observable<Rating> {
        return this.httpService.post(this.baseUrl + locationId + '/ratings', JSON.stringify(rating), {headers: this.contentHeader})
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch((error) => this.handleError(error));
    }

    updateRating(locationId: number, rating: Rating): Observable<Rating> {
        return this.httpService.put(this.baseUrl + locationId + '/ratings', JSON.stringify(rating), {headers: this.contentHeader})
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch((error) => this.handleError(error));
    }

    deleteRating(locationId: number, ratingId: number): Observable<Rating> {
        return this.httpService.delete(this.baseUrl + locationId + '/ratings/' + ratingId)
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch((error) => this.handleError(error));
    }
}

