import {Injectable} from "@angular/core";
import {Headers} from "@angular/http";
import {Observable} from "rxjs";
import {Rating} from "../models/rating";
import {AbstractApiService} from "./abstract.api.service";
import {ConfigService} from "./config.service";
import {HttpService} from "./http.service";

@Injectable()
export class RatingService extends AbstractApiService {
    private contentHeader: Headers = new Headers({"Content-Type": "application/json"});

    constructor(private httpService: HttpService, configService: ConfigService) {
        super(configService);
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
            .catch(this.handleError);
    }

    getRating(locationId: number, ratingId: number): Observable<Rating> {
        return this.httpService.get(this.baseUrl + locationId + '/ratings/' + ratingId)
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    createRating(locationId: number, rating: Rating): Observable<Rating> {
        return this.httpService.post(this.baseUrl + locationId + '/ratings', JSON.stringify(rating), {headers: this.contentHeader})
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    updateRating(locationId: number, rating: Rating): Observable<Rating> {
        return this.httpService.put(this.baseUrl + locationId + '/ratings', JSON.stringify(rating), {headers: this.contentHeader})
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    deleteRating(locationId: number, ratingId: number): Observable<Rating> {
        return this.httpService.delete(this.baseUrl + locationId + '/ratings/' + ratingId)
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch(this.handleError);
    }
}

