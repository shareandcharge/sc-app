import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import 'rxjs/add/operator/map';
import {Location} from "../models/location";
import {AuthHttp} from "angular2-jwt";
import {Response} from "@angular/http";

@Injectable()
export class LocationService {

    private baseUrl: string = 'https://api-test.shareandcharge.com/v1';

    constructor(private authHttp: AuthHttp) {
    }

    getLocations(): Observable<Array<Location>> {
        return this.authHttp.get(this.baseUrl + '/locations')
            .map(res => {
                console.log(res);
                let locations = [];
                res.json().forEach(input => {
                    locations.push(new Location().deserialize(input));
                });
                return locations;
            })
            .catch(this.handleError);
    }

    /**
     * @TODO should have an endpoint or parameter; not read _all_ locations
     */
    getLocationsUser(userAddress: string) {
        return this.getLocations().map(res => {
            let locations = [];
            res.forEach(location => {
                if (location.owner == userAddress) {
                    locations.push(location);
                }
            });
            return locations;
        });
    }

    getLocationsPlugTypes(plugTypes: string) {
        return this.authHttp.get(this.baseUrl + '/locations?plugType=' + plugTypes)
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
                let lat = location.lat;
                let lng = location.lng;

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
        return this.authHttp.get(`${this.baseUrl}/locations/${id}`)
            .map(res => {
                return new Location().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    updateLocation(location: Location) {
        return this.authHttp.post(`${this.baseUrl}/locations/${location.id}`, location.serialize())
            .map(res => res.json())
            .catch(this.handleError);
    }

    createLocation(location: Location): Observable<Location> {
        return this.authHttp.post(`${this.baseUrl}/locations`, location.serialize())
            .map(res => {
                return new Location().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    deleteLocation(id) {
        return this.authHttp.delete(`${this.baseUrl}/locations/${id}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body.message  || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}