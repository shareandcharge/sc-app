import {Serializable} from './serializable';
import {isDefined, isBlank, isArray} from "ionic-angular/util/util";

export class User implements Serializable<User> {
    public static readonly COMMERCIAL_CATEGORY_HOTEL = 1;
    public static readonly COMMERCIAL_CATEGORY_RESTAURANT = 2;

    id: any;
    email: string;
    address: string;
    profile: any;
    cars: any;
    authentification: any;
    commercialCategory: Array<number>;

    private _creditCards: any;

    constructor() {
        this.id = '';
        this.email = '';
        this.address = '';
        this.profile = {};
        this.cars = {};

        this.authentification = {};

        this.commercialCategory = [];
        this.authentification.apnDeviceTokens = [];
        this.authentification.gcmDeviceTokens = [];
    }

    hasImage() {
        return (typeof this.profile.imageBase64 === "string" && this.profile.imageBase64 !== '');
    }

    get displayImageSrc(): string {
        return this.hasImage() ? this.profile.imageBase64 : 'assets/images/user-default.png';
    }

    get displayName() {
        return `${this.profile.firstname} ${this.profile.lastname}`;
    }

    isProfileComplete() {
        let fields = ['firstname', 'lastname', 'address', 'country', 'postalCode', 'city'];
        let allComplete = true;

        fields.forEach(field => {
            let fieldComplete = isDefined(this.profile[field]) && !isBlank(this.profile[field]) && this.profile[field].trim() != '';
            allComplete = allComplete && fieldComplete;
        });

        return allComplete;
    }

    isEmailVerified(): boolean {
        let email = this.email;

        if (!this.authentification.verifiedEmails || !Array.isArray(this.authentification.verifiedEmails) || !email) return false;

        return this.authentification.verifiedEmails.indexOf(email) > -1;
    }

    initTokenArrays() {
        if (!isArray(this.authentification.apnDeviceTokens)) {
            this.authentification.apnDeviceTokens = [];
        }

        if (!isArray(this.authentification.gcmDeviceTokens)) {
            this.authentification.gcmDeviceTokens = [];
        }
    }

    deviceTokenExists(deviceToken) {
        this.initTokenArrays();

        return this.authentification.apnDeviceTokens.indexOf(deviceToken) !== -1
            || this.authentification.gcmDeviceTokens.indexOf(deviceToken) !== -1
    }

    addDeviceToken(deviceToken, platform) {
        this.initTokenArrays();

        if (platform === 'ios') {
            this.authentification.apnDeviceTokens.push(deviceToken);
        }

        if (platform === 'android') {
            this.authentification.gcmDeviceTokens.push(deviceToken);
        }
    }

    hasCreditCards(): boolean {
        return this._creditCards.length > 0;
    }

    getCreditCards(): any[] {
        return this._creditCards;
    }

    hasTrackingFlag(): boolean {
        return typeof this.profile.disableTracking !== 'undefined';
    }

    trackingDisable() {
        this.profile.disableTracking = true;
    }

    trackingEnable() {
        this.profile.disableTracking = false;
    }

    isTrackingDisabled() {
        return this.profile.disableTracking === true;
    }

    isTrackingEnabled() {
        return !this.isTrackingDisabled();
    }

    getLanguage(): string|null {
        return this.profile.language || null;
    }

    setLanguage(language) {
        this.profile.language = language;
    }

    hasLanguage(): boolean {
        return typeof this.profile.language !== 'undefined';
    }

    deserialize(input) {
        this.id = input.id;
        this.email = input.email;
        this.profile = input.profile;
        this.cars = input.cars;
        this.address = input.address;
        this.authentification = input.authentification;

        this._creditCards = [];

        if (typeof this.authentification.cards === 'object') {
            Object.keys(this.authentification.cards).forEach((key) => {
                //-- this check is to support an older version
                if ('cc' === this.authentification.cards[key]) {
                    this._creditCards.push({
                        id: key,
                        type: 'cc',
                        descr: 'xxxxx123'
                    });
                }
                else if (typeof this.authentification.cards[key] === 'object'
                    && 'cc' == this.authentification.cards[key].type) {
                    this._creditCards.push(this.authentification.cards[key]);
                }
            });
        }

        return this;
    }
}