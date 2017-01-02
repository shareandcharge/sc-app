import {Connector} from "./connector";

export class Station {
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

    deserialize(input): Station {
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