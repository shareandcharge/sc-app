import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import 'rxjs/add/operator/map';
import {Location} from "../models/location";
import {AbstractApiService} from "./abstract.api.service";
import {RequestOptions, URLSearchParams} from "@angular/http";
import {ConfigService} from "./config.service";
import {HttpService} from "./http.service";
import {AuthService} from "./auth.service";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class LocationService extends AbstractApiService {

    private imagesBaseUrl: string;

    constructor(private httpService: HttpService, public configService: ConfigService, 
        private authService: AuthService, public translateService: TranslateService) {
        super(configService, translateService);
        this.imagesBaseUrl = this.configService.get('IMAGES_BASE_URL');
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
            .catch((error) => this.handleError(error));
    }

    /**
     * @TODO should have an endpoint or parameter; not read _all_ locations
     */
    getLocationsUser(userAddress: string): Observable<Array<Location>> {
        return this.getLocations({owner: userAddress, limit: 100});
    }

    searchLocations(bounds?: any, plugTypes?: any, fields?: string) {
        let checkBounds = <boolean>bounds;
        let params = fields ? {fields: fields} : null;

        if (Array.isArray(plugTypes) && plugTypes.length > 0) params['plugType'] = plugTypes.join(',');

        return this.getLocations(params).map(res => {

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
                const location = new Location().deserialize(res.json());
                return location;
            })
            .catch((error) => this.handleError(error));
    }

    updateLocation(location: Location) {
        return this.httpService.put(`${this.baseUrl}/locations/${location.id}`, location.serialize())
            .map(res => res.json())
            .catch((error) => this.handleError(error));
    }

    createLocation(location: Location): Observable<Location> {
        return this.httpService.post(`${this.baseUrl}/locations`, location.serialize())
            .map(res => {
                return new Location().deserialize(res.json());
            })
            .catch((error) => this.handleError(error));
    }

    deleteLocation(id) {
        return this.httpService.delete(`${this.baseUrl}/locations/${id}`)
            .map(res => res.json())
            .catch((error) => this.handleError(error));
    }

    getPrice(connectorId, priceObject) {
        return this.httpService.post(this.baseUrl + '/connectors/' + connectorId + '/price', JSON.stringify(priceObject))
            .map(res => res.json())
            .catch((error) => this.handleError(error));
    }

    //check out this...
    getEstimatedPrice(pricePerHour, pricePerKW, maxWattPower) {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set('pricePerHour', pricePerHour);
        searchParams.set('pricePerKW', pricePerKW);
        searchParams.set('maxWattPower', maxWattPower);

        let options = new RequestOptions({search: searchParams});

        return this.httpService.get(this.baseUrl + '/connectors/price', options)
            .map(res => res.json())
            .catch((error) => this.handleError(error));
    }

    /**
     * is the given location for the current user marked as "busy"
     * @param location
     * @returns {boolean}
     */
    isBusy(location: Location): boolean {
        let busy = false;

        if (location.isRented()
            || location.isClosed()
            || (this.authService.loggedIn() && !location.isMatchingPlugtype())
        ) {
            busy = true;
        }

        return busy;
    }

    getImagesWithSrc(location: Location): Array<any> {
        if (!location.hasImages()) return [];

        let images = [];

        for (let image of location.images) {
            if (typeof image.url !== 'undefined') {
                images.push({
                    id: image.id,
                    url: image.url,
                    src: this.getImageSrc(image)
                });
            }
        }

        return images;
    }

    getImageSrc(image): string {
        return 'http' == image.url.substr(0, 4) ? image.url : this.imagesBaseUrl + image.url;
    }
}