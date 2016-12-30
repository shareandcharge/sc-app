import {Serializable} from './serializable';

export class Location implements Serializable<Location> {
    id: any;
    owner: string;
    name: string;
    description: string;
    images: Array<string>;
    contact: string;
    lat: any;
    lng: any;
    address: string;
    stations: any;
    active: boolean;

    // TODO: update Model and reflect changes in create location flow
    // Location {
    //     stations [ Station ]
    // }
    //
    // Station {
    //     active: ...
    //     connectors [ Conenctor ]
    // }

    constructor() {
        this.id = '';
        this.owner = '';
        this.name = '';
        this.description = '';
        this.images = [];
        this.contact = '';
        this.lat = '';
        this.lng = '';
        this.address = '';
        this.stations = {};
        this.active = true;
    }

    deserialize(input) {

        this.id = input.id;
        this.owner = input.owner;
        this.name = input.name;
        this.description = input.description;
        this.images = input.images;
        this.contact = input.contact;
        this.lat = input.lat;
        this.lng = input.lng;
        this.address = input.address;
        this.stations = input.stations;
        this.active = input.active;

        return this;
    }
}