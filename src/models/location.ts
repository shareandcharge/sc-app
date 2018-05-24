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
    available: boolean;
    open: boolean;
    matchesPlugtype: boolean;
    metadata: {
        problemSolver: string
    };
    ownerprofile: {
        address: string,
        city: string,
        firstname: string,
        lastname: string,
        postalCode: string,
        operatorVatID: string
    };
    commercialcategory: {
      category: Array<number>
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
        this.available = true;
        this.open = true;
        this.metadata = {
            problemSolver: ''
        };
        this.ownerprofile = {
            address: '',
            city: '',
            firstname: '',
            lastname: '',
            postalCode: '',
            operatorVatID: ''
        };
        this.commercialcategory = {
          category: []
        }
    }

    isRented(): boolean {
        return !this.available;
    }

    isClosed(): boolean {
        return !this.open;
    }

    isOpen(): boolean {
        return this.open;
    }

    isMatchingPlugtype(): boolean {
        return this.matchesPlugtype;
    }

    serialize() {
        return JSON.stringify(this);
    }

    hasStation(): boolean {
        return Array.isArray(this.stations) && typeof this.stations[0] === 'object';
    }

    getFirstStation(orEmpty?: boolean): Station | null {
        if (this.hasStation()) {
            return this.stations[0];
        }
        else {
            return orEmpty ? new Station() : null;
        }
    }

    getFirstStationOrEmpty(): Station {
        return this.getFirstStation(true);
    }

    hasImages(): boolean {
        return Array.isArray(this.images) && this.images.length > 0;
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
        this.available = input.available;
        this.active = input.active;
        this.open = input.open;
        this.matchesPlugtype = input.matchesPlugtype;
        this.metadata = input.metadata;
        this.ownerprofile = input.ownerprofile;
        this.commercialcategory = input.commercialcategory;

        // if (input.images) {
        //     this.images = input.images;
        //     for (let image of this.images) {
        //         if (typeof image.url !== 'undefined') {
        //             image.src = 'https://api-test.shareandcharge.com' + image.url;
        //         }
        //     }
        // }

        let deserializedStations = [];
        if (input.stations) {
            for (let station of input.stations) {
                deserializedStations.push(new Station().deserialize(station));
            }
        }
        this.stations = deserializedStations;

        return this;
    }
}
