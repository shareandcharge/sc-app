import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {Observable} from "rxjs";
import {Rating} from "../models/rating";

@Injectable()
export class RatingService {
    private baseUrl: string = 'http://5834821b62f23712003730c0.mockapi.io/api/v1/locations/';
    private contentHeader: Headers = new Headers({"Content-Type": "application/json"});

    constructor(private http: Http) {
    }

    getRatings(locationId: number): Observable<Array<Rating>> {
        return this.http.get(this.baseUrl + locationId + '/ratings')
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
        return this.http.get(this.baseUrl + locationId + '/ratings/' + ratingId)
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    createRating(locationId: number, rating: Rating): Observable<Rating> {
        return this.http.post(this.baseUrl + locationId + '/ratings', JSON.stringify(rating), {headers: this.contentHeader})
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    updateRating(locationId: number, rating: Rating): Observable<Rating> {
        return this.http.put(this.baseUrl + locationId + '/ratings', JSON.stringify(rating), {headers: this.contentHeader})
            .map(res => {
                return new Rating().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    deleteRating(locationId: number, ratingId: number): Observable<Rating> {
        return this.http.delete(this.baseUrl + locationId + '/ratings/' + ratingId)
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

