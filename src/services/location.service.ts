import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

// export interface MyLocation {
//     id: number | string;
//     createdAt: number;
//     value: string;
// }

class Location {
    id: string;
    name: string;
    latitude: string;
    longitude: string;

    constructor(location: any) {
        if (location) {
            this.id = location.id;
            this.name = location.name;
            this.latitude = location.latitude;
            this.longitude = location.longitude;
        }
    }
}

@Injectable()
export class LocationService {
    // locations: Observable<MyLocation[]>;
    // private _locations: BehaviorSubject<MyLocation[]>;
    private baseUrl: string;
    // private dataStore: {
    //     locations: MyLocation[]
    // };

    constructor(private http: Http) {
        this.baseUrl = 'http://5834821b62f23712003730c0.mockapi.io/api/v1';
        // this.dataStore = { locations: [] };
        // this._locations = <BehaviorSubject<MyLocation[]>>new BehaviorSubject([]);
        // this.locations = this._locations.asObservable();
    }

    getAll() {
        return this.http.get(`${this.baseUrl}/locations`)
            .map(response => response.json());
        // this.http.get(`${this.baseUrl}/locations`).map(response => response.json()).subscribe(data => {
        //     this.dataStore.locations = data;
        //     this._locations.next(Object.assign({}, this.dataStore).locations);
        // }, error => console.log('Could not load locations.'));
    }

    // load(id: number | string) {
    //     this.http.get(`${this.baseUrl}/locations/${id}`).map(response => response.json()).subscribe(data => {
    //         let notFound = true;
    //
    //         this.dataStore.locations.forEach((item, index) => {
    //             if (item.id === data.id) {
    //                 this.dataStore.locations[index] = data;
    //                 notFound = false;
    //             }
    //         });
    //
    //         if (notFound) {
    //             this.dataStore.locations.push(data);
    //         }
    //
    //         this._locations.next(Object.assign({}, this.dataStore).locations);
    //     }, error => console.log('Could not load todo.'));
    // }
    //
    // create(todo: Location) {
    //     this.http.post(`${this.baseUrl}/locations`, JSON.stringify(todo))
    //         .map(response => response.json()).subscribe(data => {
    //         this.dataStore.locations.push(data);
    //         this._locations.next(Object.assign({}, this.dataStore).locations);
    //     }, error => console.log('Could not create todo.'));
    // }
    //
    // update(todo: Location) {
    //     this.http.put(`${this.baseUrl}/locations/${todo.id}`, JSON.stringify(todo))
    //         .map(response => response.json()).subscribe(data => {
    //         this.dataStore.locations.forEach((t, i) => {
    //             if (t.id === data.id) { this.dataStore.locations[i] = data; }
    //         });
    //
    //         this._locations.next(Object.assign({}, this.dataStore).locations);
    //     }, error => console.log('Could not update todo.'));
    // }
    //
    // remove(todoId: number) {
    //     this.http.delete(`${this.baseUrl}/locations/${todoId}`).subscribe(response => {
    //         this.dataStore.locations.forEach((t, i) => {
    //             if (t.id === todoId) { this.dataStore.locations.splice(i, 1); }
    //         });
    //
    //         this._locations.next(Object.assign({}, this.dataStore).locations);
    //     }, error => console.log('Could not delete todo.'));
    // }
}