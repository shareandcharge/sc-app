import {Serializable} from './serializable';
import {Station} from "./station";

export class Location implements Serializable<Location> {
    id: any;
    owner: string;
    name: string;
    description: string;
    images: Array<any>;
    contact: string;
    lat: any;
    lng: any;
    address: string;
    stations: Array<Station>;
    active: boolean;
    metadata: {
        problemSolver: string
    };

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
        this.stations = [];
        this.active = true;
        this.metadata = {
            problemSolver: ''
        };
    }

    /**
     * A station is rented when all of it's stations are rented
     * or if there are no stations at all.
     * @returns {boolean}
     */
    isRented():boolean {
        let isRented = true;

        this.stations.forEach((connector) => {
            isRented = isRented && connector.isRented();
        });

        return isRented;
    }

    serialize() {
        return JSON.stringify(this);
    }

    deserialize(input): Location {
        this.id = input.id;
        this.owner = input.owner;
        this.name = input.name;
        this.description = input.description;
        this.contact = input.contact;
        this.lat = input.lat;
        this.lng = input.lng;
        this.address = input.address;
        this.active = input.active;
        this.metadata = input.metadata;

        this.images = input.images;
        for (let image of this.images) {
            if (typeof image.url !== 'undefined') {
                image.src = 'https://api-test.shareandcharge.com' + image.url;
            }
        }

        let deserializedStations = [];
        for (let station of input.stations) {
            deserializedStations.push(new Station().deserialize(station));
        }
        this.stations = deserializedStations;

        return this;
    }
}