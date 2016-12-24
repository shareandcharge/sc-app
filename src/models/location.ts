import {Serializable} from './serializable';

export class Location implements Serializable<Location> {
    id: any;
    owner: string;
    name: string;
    description: string;
    images: Array<string>;
    contact: string;
    latitude: any;
    longitude: any;
    address: string;
    stations: any;

    constructor() {
        this.id = '';
        this.owner = '';
        this.name = '';
        this.description = '';
        this.images = [];
        this.contact = '';
        this.latitude = '';
        this.longitude = '';
        this.address = '';
        this.stations = '';
    }

    deserialize(input) {

        this.id = input.id;
        this.owner = input.owner;
        this.name = input.name;
        this.description = input.description;
        this.images = input.images;
        this.contact = input.contact;
        this.latitude = input.latitude;
        this.longitude = input.longitude;
        this.address = input.address;
        this.stations = input.stations;

        return this;
    }
}