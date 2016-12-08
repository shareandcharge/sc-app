import {Serializable} from './serializable';

export class Car implements Serializable<Car> {
    plateNumber: any;
    model: any;
    manufacturer: any;
    akkuCapacity: any;
    averageDistance: any;
    plugTypes: any[];

    constructor() {
        this.plateNumber = '';
        this.model = '';
        this.manufacturer = '';
        this.akkuCapacity = '';
        this.averageDistance = '';
        this.plugTypes = [];
    }

    /*  setPlateNumber(plateNumber) {
     this.plateNumber = plateNumber;
     }

     getPlateNumber() {
     return this.plateNumber;
     }*/

    deserialize(input) {
        this.plateNumber = input.plateNumber;
        this.manufacturer = input.manufacturer;
        this.model = input.model;
        this.akkuCapacity = input.accuCapacity;
        this.plugTypes = input.plugTypes;

        return this;
    }
}