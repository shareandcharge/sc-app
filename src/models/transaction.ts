import {Serializable} from './serializable';

export class Transaction implements Serializable<Transaction> {
    /**
     * Types
     * - Voucher
     * - Voucher-pending (getting the amount as vouchers)
     * - Payout
     * - Payout-pending (payout money and reduce the balance, should have a property 'order' for details)
     * - TokenUpdate
     * - TokenUpdate-pending  (create new Tokens after pay in; should have a property 'order' for details)
     * - Send (after using a charging-station; should have a property 'receipt' for details)
     * - Received (after receiving money as owner of a charging station; should have a property 'receipt' for details)
     */
    readonly TYPE_UNKNOWN = -1;
    readonly TYPE_VOUCHER = 10;
    readonly TYPE_VOUCHER_PENDING = 20;
    readonly TYPE_PAYOUT = 30;
    readonly TYPE_PAYOUT_PENDING = 40;
    readonly TYPE_TOKENUPDATE = 50;
    readonly TYPE_TOKENUPDATE_PENDING = 60;
    readonly TYPE_SEND = 70;
    readonly TYPE_RECEIVED = 80;

    //-- There are more fields; for now we only include the ones we need
    id: number;
    amount: number;
    typeString: string;
    type: number;
    timestamp: string;
    date: any;
    tariff: any;
    start: number;
    end: number;
    duration: number;
    location: any;

    order?: any;
    receipt?: any;

    constructor() {
        this.id = null;
        this.amount = 0;
        this.typeString = '';
        this.type = null;
        this.timestamp = '';
        this.date = '';
        this.order = null;
        this.receipt = null;
        this.tariff = null;
        this.start = null;
        this.end = null;
        this.duration = null;
        this.location = null;
    }

    /**
     * If we have order or receipt we return the timestamp of that
     * @returns {string}
     */
    getTimestamp(): string {
        if (this.isVoucher() && this.isPending()) {
            return this.date;
        }
        else if (this.order) {
            return this.order.timestamp;
        }
        else if (this.receipt) {
            return this.receipt.timestamp;
        }
        else {
            return this.timestamp;
        }
    }

    isVoucher(): boolean {
        return this.TYPE_VOUCHER_PENDING === this.type
            || this.TYPE_VOUCHER === this.type;
    }

    isPayOut(): boolean {
        return this.TYPE_PAYOUT_PENDING === this.type
            || this.TYPE_PAYOUT === this.type;
    }

    isPayIn(): boolean {
        return this.TYPE_TOKENUPDATE_PENDING === this.type
            || this.TYPE_TOKENUPDATE === this.type;
    }

    isSend(): boolean {
        return this.TYPE_SEND === this.type;
    }

    isReceived(): boolean {
        return this.TYPE_RECEIVED === this.type;
    }


    isPending(): boolean {
        return this.TYPE_VOUCHER_PENDING === this.type
            || this.TYPE_PAYOUT_PENDING === this.type
            || this.TYPE_TOKENUPDATE_PENDING === this.type;
    }

    isAmountPositiv() {
        return this.isVoucher()
            || this.isPayIn()
            || this.isReceived();
    }

    hasOrder(): boolean {
        return !!this.order;
    }

    deserialize(input) {
        this.id = input.id;
        this.amount = input.amount;
        this.typeString = input.type;
        this.type = this.typeFromString(input.type);
        this.timestamp = input.timestamp;
        this.date = new Date(input.date*1000);
        this.order = input.order;
        this.receipt = input.receipt;
        this.tariff = input.tariff;
        this.start = input.start;
        this.end = input.end;
        this.duration = this.end - this.start;
        this.location = input.location || undefined;
        

        return this;
    }

    typeFromString(type: string): number {
        switch (type) {
            case 'Voucher':
                return this.TYPE_VOUCHER;
            case 'Voucher-pending':
                return this.TYPE_VOUCHER_PENDING;
            case 'Payout':
                return this.TYPE_PAYOUT;
            case 'Payout-pending':
                return this.TYPE_PAYOUT_PENDING;
            case 'TokenUpdate':
                return this.TYPE_TOKENUPDATE;
            case 'TokenUpdate-pending':
                return this.TYPE_TOKENUPDATE_PENDING;
            case 'Send':
                return this.TYPE_SEND;
            case 'Received':
                return this.TYPE_RECEIVED;
        }

        return this.TYPE_UNKNOWN;
    }
}