import {Serializable} from './serializable';

export class Rating implements Serializable<Rating> {
    id: number;
    createdAt: Date;
    user: number;
    value: number;
    remark: string;

    constructor() {
        this.id = null;
        this.createdAt = null;
        this.user = null;
        this.value = 0;
        this.remark = '';
    }

    deserialize(input) {
        this.id = input.id;
        this.createdAt = input.createdAt;
        this.user = input.user;
        this.value = input.value;
        this.remark = input.remark;

        return this;
    }
}