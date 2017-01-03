import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {Observable} from "rxjs";
import {Rating} from "../models/rating";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class RatingService {
    private baseUrl: string = 'https://api-test.shareandcharge.com/v1/locations/';
    private contentHeader: Headers = new Headers({"Content-Type": "application/json"});

    constructor(private http: Http, private authHttp: AuthHttp) {
    }

    getRatings(locationId: number): Observable<Array<Rating>> {
        return this.authHttp.get(this.baseUrl + locationId + '/ratings')
            .map(res => {
                let ratings = [];
                if (res.json() != null) {
                    console.log(res.json());
                    res.json().forEach(input => {
                        ratings.push(new Rating().deserialize(input));
                    });
                }
                return ratings;
            })
            .catch(this.handleError);
    }

    getRating(locationId: number, ratingId: number): Observable<Rating> {
        return this.authHttp.get(this.baseUrl + locationId + '/ratings/' + ratingId)
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    createRating(locationId: number, rating: Rating): Observable<Rating> {
        return this.authHttp.post(this.baseUrl + locationId + '/ratings', JSON.stringify(rating), {headers: this.contentHeader})
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    updateRating(locationId: number, rating: Rating): Observable<Rating> {
        return this.authHttp.put(this.baseUrl + locationId + '/ratings', JSON.stringify(rating), {headers: this.contentHeader})
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    deleteRating(locationId: number, ratingId: number): Observable<Rating> {
        return this.authHttp.delete(this.baseUrl + locationId + '/ratings/' + ratingId)
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    handleError(error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Ratings server error');
    }
}

