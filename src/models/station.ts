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
    isRented(): boolean {
        let isRented = true;

        if (!this.hasConnector()) return isRented;

        this.connectors.forEach((connector) => {
            isRented = isRented && connector.isRented;
        });

        return isRented;
    }


    hasConnector(): boolean {
        return Array.isArray(this.connectors) && typeof this.connectors[0] === 'object';
    }

    getFirstConnector(orEmpty?: boolean): Connector | null {
        if (this.hasConnector()) {
            return this.connectors[0];
        }
        else {
            return orEmpty ? new Connector() : null;
        }
    }

    getFirstConnectorOrEmpty(): Connector {
        return this.getFirstConnector(true);
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