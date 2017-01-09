import {Connector} from "./connector";

export class Station {
    id: any;
    name: string;
    active: boolean;
    connectors: Array<Connector>;

    constructor() {
        this.name = '';
        this.active = true;
        this.connectors = [];
    }

    serialize(): string {
        return JSON.stringify(this);
    }

    /**
     * A station is rented when all of it's connectors are rented
     * or if there are no connectors at all.
     * @returns {boolean}
     */
    isRented():boolean {
        let isRented = true;

        this.connectors.forEach((connector) => {
            isRented = isRented && connector.isRented;
        });

        return isRented;
    }

    deserialize(input): Station {
        this.id = input.id;
        this.name = input.name;
        this.active = input.active;

        let deserializedConnectors = [];
        for (let connector of input.connectors) {
            deserializedConnectors.push(new Connector().deserialize(connector));
        }
        this.connectors = deserializedConnectors;

        return this;
    }
}