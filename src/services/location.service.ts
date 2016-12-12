import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from "rxjs";

import 'rxjs/add/operator/map';
import {Location} from "../models/location";

@Injectable()
export class LocationService {

    private baseUrl: string = 'http://5834821b62f23712003730c0.mockapi.io/api/v1';
    private contentHeader: Headers = new Headers({"Content-Type": "application/json"});

    constructor(private http: Http) {
    }

    getLocations() {
        return this.http.get(this.baseUrl + '/locations')
            .map(res => {
                let locations = [];
                res.json().forEach(input => {
                    locations.push(new Location().deserialize(input));
                });
                return locations;
            })
            .catch(this.handleError);
    }

    searchLocations(bounds?: any) {
        let checkBounds = <boolean>bounds;
        return this.getLocations().map(res => {

            let locations = [];
            res.forEach(location => {
                let lat = location.latitude;
                let lng = location.longitude;

                if (checkBounds && lat >= bounds.latFrom && lat <= bounds.latTo && lng >= bounds.lngFrom && lng <= bounds.lngTo) {
                    locations.push(location);
                }
                else if (!checkBounds) {
                    locations.push(location);
                }

            });
            return locations;

        });
    }

    getLocation(id): Observable<Location> {
        return this.http.get(`${this.baseUrl}/locations/${id}`)
            .map(res => {
                return new Location().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    updateLocation(location: Location) {
        return this.http.put(`${this.baseUrl}/locations/${location.id}`, JSON.stringify(location), {headers: this.contentHeader})
            .map(res => res.json())
            .catch(this.handleError);
    }

    createLocation(location: Location): Observable<Location> {
        return this.http.post(`${this.baseUrl}/locations`, JSON.stringify(location), {headers: this.contentHeader})
            .map(res => {
                return new Location().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    deleteLocation(id) {
        return this.http.delete(`${this.baseUrl}/locations/${id}`, {headers: this.contentHeader})
            .map(res => res.json())
            .catch(this.handleError);
    }

    handleError(error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Locations server error');
    }

}