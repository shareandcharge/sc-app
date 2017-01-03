import {Serializable} from './serializable';

export class Rating implements Serializable<Rating> {
    id: number;
    createdAt: Date;
    user: number;
    rating: number;
    remark: string;

    constructor() {
        this.id = null;
        this.createdAt = null;
        this.user = null;
        this.rating = 0;
        this.remark = '';
    }

    deserialize(input) {
        this.id = input.id;
        this.createdAt = input.createdAt;
        this.user = input.user;
        this.rating = input.rating;
        this.remark = input.remark;

        return this;
    }
}