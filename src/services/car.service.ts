import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Car} from "../models/car";

import 'rxjs/add/operator/map';
import {AuthService} from "./auth.service";
import {AbstractApiService} from "./abstract.api.service";
import {ConfigService} from "./config.service";
import {HttpService} from "./http.service";

@Injectable()
export class CarService extends AbstractApiService {
    private activeCar: Car = null;

    constructor(private httpService: HttpService, private auth: AuthService, public configService: ConfigService) {
        super(configService);
    }

    setActiveCar(car: Car) {
        this.activeCar = car;
    }

    getActiveCar() {
        return this.activeCar;
    }

    getCars(): Observable<Car[]> {
        if (!this.auth.loggedIn()) {
            return Observable.of(null);
        }

        return this.httpService.get(this.baseUrl + '/users/cars')
            .map(res => {
                let cars = [];
                let data = res.json();

                data.cars.list.forEach(input => {
                    let car = new Car().deserialize(input);
                    cars.push(car);
                    if (+car.id == data.cars.current) {
                        this.setActiveCar(car);
                    }
                });

                return cars;
            })
    }

    getCar(id): Observable<Car> {
        return this.httpService.get(`${this.baseUrl}/users/cars/${id}`)
            .map(res => {
                return new Car().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    updateCar(car: Car): Observable<Car> {
        return this.httpService.put(`${this.baseUrl}/users/${this.auth.getUser().address}/cars/${car.id}`, JSON.stringify(car))
            .map(res => res.json())
            .catch(this.handleError);
    }

    // createCar(car: Car): Observable<Car> {
    createCar(car: Car) {
        return this.httpService.post(`${this.baseUrl}/users/${this.auth.getUser().address}/cars`, JSON.stringify(car))
            .map(res => {
                return new Car().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    deleteCar(id) {
        return this.httpService.delete(`${this.baseUrl}/users/${this.auth.getUser().address}/cars/${id}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    selectAsActiveCar(car: Car) {
        let postData = {
            'current': car.id
        };

        return this.httpService.post(`${this.baseUrl}/users/${this.auth.getUser().address}/cars`, JSON.stringify(postData))
            .map(res => {
                let data = res.json();

                if (data.current == car.id) {
                    this.setActiveCar(car);
                } else {
                    Observable.throw("error while selecting car as active");
                }
                return data;
            });
    }

    getManufacturers(): Observable<any[]> {
        return this.httpService.get(this.baseUrl + '/users/predefinedCars')
            .map(res => {
                let r = res.json();
                let manufacturers = r.map(function (obj) {
                    return obj.brand.trim();
                });
                manufacturers = manufacturers.filter(function (v, i) {
                    return manufacturers.indexOf(v) == i;
                });
                return manufacturers;
            });
    }

    getModels(manufacturer): Observable<any[]> {
        return this.httpService.get(this.baseUrl + '/users/predefinedCars')
            .map(res => {
                let r = res.json();
                let models = r.filter((obj) => {
                    return obj.brand.trim() == manufacturer;
                }).map((obj) => {
                    return obj
                });
                return models;
            });
    }
}