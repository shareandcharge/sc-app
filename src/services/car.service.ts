import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from "rxjs";
import {Car} from "../models/car";

import 'rxjs/add/operator/map';
import {AuthService} from "./auth.service";

@Injectable()
export class CarService {

    private tmpManuData: Array<any>;

    private baseUrl: string = 'http://5834821b62f23712003730c0.mockapi.io/api/v1';
    private contentHeader: Headers = new Headers({"Content-Type": "application/json"});

    private activeCar: Car;

    private tmpActiveOverwrite: boolean = false;

    constructor(private auth: AuthService, private http: Http) {
        this.setTempData();
    }

    setActiveCar(car: Car) {
        this.activeCar = car;
    }

    /**
     * Get active car of user
     * @TODO this will only return a result after the list has been loaded...
     * @returns {Car}
     */
    getActiveCar() {
        return this.activeCar;
    }

    getCars(): Observable<Car[]> {
        if (!this.auth.loggedIn()) {
            this.tmpActiveOverwrite = false;
            this.activeCar = null;
            return Observable.of([]);
        }

        return this.http.get(this.baseUrl + '/cars')
            .map(res => {
                let cars = [];
                let data = res.json();

                data.forEach(input => {
                    cars.push(new Car().deserialize(input));
                });

                //-- @TODO the final API will sent the current car in a separate field
                if (cars.length) {
                    /**
                     * @TODO this `tmpActiveOverwrite` is only here because the mockup api does not save the active car.
                     *      So once we set it, it won't be overwritten by the list loading.
                     *      When we wired the real api, this should be removed
                     */
                    if (!this.tmpActiveOverwrite) {
                        this.tmpActiveOverwrite = true;

                        this.setActiveCar(cars[0]);
                    }
                }

                return cars;
            })
            .catch(this.handleError);
    }

    getCar(id): Observable<Car> {
        return this.http.get(`${this.baseUrl}/cars/${id}`)
            .map(res => {
                return new Car().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    updateCar(car: Car): Observable<Car> {
        return this.http.put(`${this.baseUrl}/cars/${car.id}`, JSON.stringify(car), {headers: this.contentHeader})
            .map(res => res.json())
            .catch(this.handleError);
    }

    // createCar(car: Car): Observable<Car> {
    createCar(car: Car) {
        return this.http.post(`${this.baseUrl}/cars`, JSON.stringify(car), {headers: this.contentHeader})
            .map(res =>  {
                return new Car().deserialize(res.json());
            })
            .catch(this.handleError);
    }

    deleteCar(id) {
        return this.http.delete(`${this.baseUrl}/cars/${id}`, {headers: this.contentHeader})
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getManufacturers() {
        let manu = this.tmpManuData.map(manu => {
            return {"id": manu.id, "name": manu.name};
        });

        manu.sort((a, b) => {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
        return manu;
    }

    getModels(manufacturerId) {
        let a = this.tmpManuData.filter(manu => {
            return (manu.id == manufacturerId);
        });

        let models = a.pop().models;
        models.sort((a, b) => {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });

        return models;
    }

    // getManufacturers() {
    //     return this.http.get('/manufacturers')
    //         .map(res => res.json())
    //         .catch(this.handleError);
    // }

    // private handleError(error: Response) {
    //     console.error(error);
    //     return Observable.throw(error.json().error || 'Server error');
    // }


    setTempData() {
        this.tmpManuData = [{
            "id": "1",
            "name": "BMW",
            "models": [{
                "name": "i3",
                "chargeTime2_3kW": 7,
                "charTimeDrehstrom": 3,
                "chargeTimeCHAdeMO": 0.5,
                "battery": 18.8,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/BMW_i3_01.jpg/250px-BMW_i3_01.jpg",
                "ChargingLevels": [2.3, 3.7, 4.6, 7.4],
                "id": "1"
            }, {
                "name": "i8",
                "battery": 5,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/BMW_i8_IAA_2013_04.jpg/250px-BMW_i8_IAA_2013_04.jpg",
                "ChargingLevels": [2.3, 3.7],
                "id": "2"
            }]
        }, {
            "id": "2",
            "name": "Chery",
            "models": [{
                "name": "eQ",
                "chargeTime2_3kW": 9,
                "img": "http://left-lane.com/wp-content/uploads/2015/03/Auto-sales-statistics-China-Chery_eQ-EV.png",
                "ChargingLevels": [2.3, 3.7],
                "id": "1"
            }]
        }, {
            "id": "3",
            "name": "Chevrolet",
            "models": [{
                "name": "Spark EV",
                "chargeTime2_3kW": 7,
                "chargeTimeCHAdeMO": 0.33,
                "battery": 21.3,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Chevrolet_Spark_front_20100601.jpg/250px-Chevrolet_Spark_front_20100601.jpg",
                "ChargingLevels": [1.9, 2.8, 3.7],
                "id": "1"
            }, {
                "name": "Volt",
                "battery": 16,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/2011_Chevrolet_Volt_--_NHTSA_2.jpg/250px-2011_Chevrolet_Volt_--_NHTSA_2.jpg",
                "ChargingLevels": [2.3, 3.6],
                "id": "2"
            }]
        }, {
            "id": "4",
            "name": "Renault",
            "models": [{
                "name": "ZOE",
                "chargeTime2_3kW": 7.5,
                "charTimeDrehstrom": 0.5,
                "battery": 22,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Renault_Zoe_charging.jpg/250px-Renault_Zoe_charging.jpg",
                "ChargingLevels": [3.7, 11, 22],
                "id": "1"
            }, {
                "name": "Twizy (13kw)",
                "chargeTime2_3kW": 3.5,
                "battery": 6.1,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Renault_Twizy%2C_side_view.jpg/250px-Renault_Twizy%2C_side_view.jpg",
                "ChargingLevels": [2.3, 3.7],
                "id": "2"
            }]
        }, {
            "id": "5",
            "name": "VW",
            "models": [{
                "name": "E-up!",
                "chargeTime2_3kW": 9,
                "chargeTimeCHAdeMO": 0.5,
                "battery": 18.7,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/VW_e-up%21_at_Hannover_Messe.jpg/250px-VW_e-up%21_at_Hannover_Messe.jpg",
                "ChargingLevels": [2.3, 3.6],
                "id": "1"
            }, {
                "name": "e-Golf",
                "chargeTime2_3kW": 10,
                "chargeTimeCHAdeMO": 0.5,
                "battery": 24.2,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/VW_e-Golf_%28VII%29_%E2%80%93_Frontansicht%2C_19._Juni_2014%2C_D%C3%BCsseldorf.jpg/220px-VW_e-Golf_%28VII%29_%E2%80%93_Frontansicht%2C_19._Juni_2014%2C_D%C3%BCsseldorf.jpg",
                "ChargingLevels": [2.3, 3.6],
                "id": "2"
            }]
        }, {
            "id": "6",
            "name": "Zotye",
            "models": [{
                "name": "Cloud 100 EV",
                "chargeTime2_3kW": 7,
                "charTimeDrehstrom": 1,
                "img": "http://www.carnewschina.com/wp-content/uploads/2014/10/zotye-yun100-ev-launch-china-1-660x409.jpg",
                "ChargingLevels": [2.3, 3.7],
                "id": "1"
            }]
        }, {
            "id": "7",
            "name": "Kia",
            "models": [{
                "name": "Soul EV",
                "chargeTime2_3kW": 5,
                "chargeTimeCHAdeMO": 0.5,
                "battery": 27,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Kia_Soul_1.6_GDI_Spirit_%28II%29_%E2%80%93_Frontansicht%2C_17._April_2014%2C_D%C3%BCsseldorf.jpg/250px-Kia_Soul_1.6_GDI_Spirit_%28II%29_%E2%80%93_Frontansicht%2C_17._April_2014%2C_D%C3%BCsseldorf.jpg",
                "ChargingLevels": [2.3, 3.7, 4.6, 6.6],
                "id": "1"
            }]
        }, {
            "id": "8",
            "name": "Nissan",
            "models": [{
                "name": "Leaf",
                "chargeTime2_3kW": 10,
                "chargeTimeCHAdeMO": 0.5,
                "battery": 24,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Nissan_Leaf_%E2%80%93_Frontansicht%2C_28._April_2012%2C_D%C3%BCsseldorf.jpg/250px-Nissan_Leaf_%E2%80%93_Frontansicht%2C_28._April_2012%2C_D%C3%BCsseldorf.jpg",
                "ChargingLevels": [2.3, 3.3, 4.6],
                "id": "1"
            }]
        }, {
            "id": "9",
            "name": "Renault-Samsung",
            "models": [{
                "name": "SM3 EV",
                "chargeTime2_3kW": 7,
                "battery": 22,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Renault_Fluence_front_20100918.jpg/250px-Renault_Fluence_front_20100918.jpg",
                "ChargingLevels": [2.3, 3.7],
                "id": "1"
            }]
        }, {
            "id": "10",
            "name": "Tesla",
            "models": [{
                "name": "Model S 60",
                "chargeTime2_3kW": 17,
                "charTimeDrehstrom": 3.5,
                "chargeTimeCHAdeMO": 0.5,
                "battery": 60,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tesla_Model_S_in_Trondheim.JPG/250px-Tesla_Model_S_in_Trondheim.JPG",
                "ChargingLevels": [2.3, 3.7, 4.6, 7.4, 11, 22],
                "id": "1"
            }, {
                "name": "Model S P90D",
                "chargeTime2_3kW": 25.4,
                "charTimeDrehstrom": 4.8,
                "chargeTimeCHAdeMO": 0.9,
                "battery": 90,
                "img": "https://a.gaw.to/photos/2/2/9/229142_2016_Tesla_Model_S.jpg?864x540",
                "ChargingLevels": [2.3, 3.7, 4.6, 7.4, 11, 22],
                "id": "2"
            }]
        }, {
            "id": "11",
            "name": "Audi",
            "models": [{
                "name": "A3 Sportback e-tron",
                "battery": 8.8,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Audi_A3_e-tron_%2814603540286%29.jpg/250px-Audi_A3_e-tron_%2814603540286%29.jpg",
                "ChargingLevels": [2.3, 3.7],
                "id": "1"
            }]
        }, {
            "id": "12",
            "name": "Mitsubishi",
            "models": [{
                "name": "Outlander PHEV",
                "battery": 12,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Mitsubishi_Outlander_PHEV_%28front_quarter%29.JPG/250px-Mitsubishi_Outlander_PHEV_%28front_quarter%29.JPG",
                "ChargingLevels": [2.3, 3.6],
                "id": "1"
            }]
        }, {
            "id": "13",
            "name": "OPEL",
            "models": [{
                "name": "Ampera",
                "battery": 16,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Opel_Ampera_ePionier_Edition_%E2%80%93_Frontansicht%2C_9._Juli_2012%2C_Heiligenhaus.jpg/250px-Opel_Ampera_ePionier_Edition_%E2%80%93_Frontansicht%2C_9._Juli_2012%2C_Heiligenhaus.jpg",
                "ChargingLevels": [2.3, 3.6],
                "id": "1"
            }]
        }, {
            "id": "14",
            "name": "Porsche",
            "models": [{
                "name": "Panamera S E-Hybrid",
                "battery": 9.4,
                "img": "https://2.bp.blogspot.com/-LY3dbhC5pLU/UVtSsZbdh8I/AAAAAAAATu0/Xq1YNxKdKHk/s400/2014-Porsche-Panamera-1%5B2%5D.jpg",
                "ChargingLevels": [2.3, 3.6],
                "id": "1"
            }]
        }, {
            "id": "15",
            "name": "918",
            "models": [{
                "name": "Spyder",
                "battery": 6.8,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Porsche_918_Spyder_IAA_2013.jpg/250px-Porsche_918_Spyder_IAA_2013.jpg",
                "ChargingLevels": [2.3, 3.6],
                "id": "1"
            }]
        }, {
            "id": "16",
            "name": "Toyota",
            "models": [{
                "name": "Prius Plug-in Hybrid",
                "battery": 4.4,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Toyota_Prius_Life_%28III%2C_Facelift%29_%E2%80%93_Frontansicht%2C_11._Februar_2013%2C_D%C3%BCsseldorf.jpg/220px-Toyota_Prius_Life_%28III%2C_Facelift%29_%E2%80%93_Frontansicht%2C_11._Februar_2013%2C_D%C3%BCsseldorf.jpg",
                "ChargingLevels": [2.3, 2.8],
                "id": "1"
            }]
        }, {
            "id": "17",
            "name": "Volvo",
            "models": [{
                "name": "V60 Plug-in Hybrid",
                "battery": 11.2,
                "img": "https://data.motor-talk.de/data/galleries/0/6/7618/46276935/41411-1-5-20461484634141393.jpg",
                "ChargingLevels": [2.3, 3.6],
                "id": "1"
            }]
        }];
    }
}
