import {Serializable} from './serializable';

export class Car implements Serializable<Car> {
    id: any;
    plateNumber: any;
    model: any;
    manufacturer: any;
    accuCapacity: any;
    averageDistance: any;
    plugTypes: any[];
    imageBase64: any;

    constructor() {
        this.id = '';
        this.plateNumber = '';
        this.model = '';
        this.manufacturer = '';
        this.accuCapacity = '';
        this.averageDistance = '';
        this.plugTypes = [];
        this.imageBase64 = '';
    }

    hasImage() {
        return (typeof this.imageBase64 === "string" && this.imageBase64 !== '');
    }

    deserialize(input) {
        this.id = input.id;
        this.plateNumber = input.plateNumber;
        this.manufacturer = input.manufacturer;
        this.model = input.model;
        this.accuCapacity = input.accuCapacity;
        this.plugTypes = input.plugTypes;
        this.imageBase64 = input.imageBase64;

        return this;
    }
}