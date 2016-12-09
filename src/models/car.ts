import {Serializable} from './serializable';

export class Car implements Serializable<Car> {
    id: any;
    plateNumber: any;
    model: any;
    manufacturer: any;
    accuCapacity: any;
    averageDistance: any;
    plugTypes: any[];

    constructor() {
        this.id = '';
        this.plateNumber = '';
        this.model = '';
        this.manufacturer = '';
        this.accuCapacity = '';
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
        this.id = input.id;
        this.plateNumber = input.plateNumber;
        this.manufacturer = input.manufacturer;
        this.model = input.model;
        this.accuCapacity = input.accuCapacity;
        this.plugTypes = input.plugTypes;

        return this;
    }
}