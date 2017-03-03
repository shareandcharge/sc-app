import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import 'rxjs/add/operator/map';
import {Location} from "../models/location";
import {AbstractApiService} from "./abstract.api.service";
import {RequestOptions, URLSearchParams} from "@angular/http";
import {ConfigService} from "./config.service";
import {HttpService} from "./http.service";

@Injectable()
export class LocationService extends AbstractApiService {

    constructor(private httpService: HttpService, public configService: ConfigService) {
        super(configService);
    }

    getLocations(params?): Observable<Array<Location>> {
        let options;

        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set('limit', '9999999');

        if (params) {
            Object.keys(params).forEach(key => searchParams.set(key, params[key]));
        }
        options = new RequestOptions({search: searchParams});

        return this.httpService.get(this.baseUrl + '/locations', options)
            .map(res => {
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
    getLocationsUser(userAddress: string): Observable<Array<Location>> {
        return this.getLocations({owner: userAddress, limit: 100});
    }

    getLocationsPlugTypes(plugTypes: string) {
        return this.getLocations({plugType: plugTypes});
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
        return this.httpService.get(`${this.baseUrl}/locations/${id}`)
            .map(res => {
                return new Location().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    updateLocation(location: Location) {
        return this.httpService.put(`${this.baseUrl}/locations/${location.id}`, location.serialize())
            .map(res => res.json())
            .catch(this.handleError);
    }

    createLocation(location: Location): Observable<Location> {
        return this.httpService.post(`${this.baseUrl}/locations`, location.serialize())
            .map(res => {
                return new Location().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    deleteLocation(id) {
        return this.httpService.delete(`${this.baseUrl}/locations/${id}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getPrice(connectorId, priceObject) {
        return this.httpService.post(this.baseUrl + '/connectors/' + connectorId + '/price', JSON.stringify(priceObject))
            .map(res => res.json())
            .catch(this.handleError);
    }

    getEstimatedPrice(pricePerHour, pricePerKW, maxWattPower) {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set('pricePerHour', pricePerHour);
        searchParams.set('pricePerKW', pricePerKW);
        searchParams.set('maxWattPower', maxWattPower);

        let options = new RequestOptions({search: searchParams});

        return this.httpService.get(this.baseUrl + '/connectors/price', options)
            .map(res => res.json())
            .catch(this.handleError);
    }
}