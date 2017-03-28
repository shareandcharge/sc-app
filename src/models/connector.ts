export class Connector {
    id: any;
    priceprovider: any;
    plugtype: string;
    maxwattpower: number;
    description: string;
    isRented: boolean;  // is called "isrented" in the backend
    station: number;    // station ID !
    timeleft: number;   // only returned when this is charging
    secondstorent: number;

    weekcalendar: {
        'hours': Array<any>
    };

    metadata: {
        accessControl: boolean,
        kwh: boolean
    };

    priceProviderTariffTypes: Array<string>;

    constructor() {
        this.priceprovider = {
            public: {
                active: false,
                selected: 'flatrate',
                flatrate: {
                    flatrateRate: 0
                },
                hourly: {
                    hourlyRate: 0,
                    parkRate: 0
                },
                kwh: {
                    kwhRate: 0,
                    parkRate: 0
                }
            },
            private: {
                active: false,
                selected: 'flatrate',
                flatrate: {
                    flatrateRate: 0
                },
                hourly: {
                    hourlyRate: 0,
                    parkRate: 0
                },
                kwh: {
                    kwhRate: 0,
                    parkRate: 0
                },
                permissions: []
            }
        };

        this.weekcalendar = {
            'hours': [
                {
                    'from': 0,
                    'to': 0
                },
                {
                    'from': 0,
                    'to': 0
                },
                {
                    'from': 0,
                    'to': 0
                },
                {
                    'from': 0,
                    'to': 0
                },
                {
                    'from': 0,
                    'to': 0
                },
                {
                    'from': 0,
                    'to': 0
                },
                {
                    'from': 0,
                    'to': 0
                }
            ]
        };

        this.id = '';
        this.plugtype = '';
        this.maxwattpower = 0;
        this.isRented = false;

        this.metadata = {
            accessControl: false,
            kwh: false
        };

        this.priceProviderTariffTypes = [
            'invalid',
            'flatrate',
            'hourly',
            'kwh'
        ];
    }

    toFrontendPriceProvider(backendPriceProvider) {
        let frontendPriceProvider = {
            public: {
                active: false,
                selected: 'flatrate',
                flatrate: {
                    flatrateRate: 0
                },
                hourly: {
                    hourlyRate: 0,
                    parkRate: 0
                },
                kwh: {
                    kwhRate: 0,
                    parkRate: 0
                }
            },
            private: {
                active: false,
                selected: 'flatrate',
                flatrate: {
                    flatrateRate: 0
                },
                hourly: {
                    hourlyRate: 0,
                    parkRate: 0
                },
                kwh: {
                    kwhRate: 0,
                    parkRate: 0
                },
                permissions: []
            }
        };

        if (backendPriceProvider.contracttype !== 0) {
            let tariff = frontendPriceProvider.public;
            tariff.active = true;
            tariff.selected = this.priceProviderTariffTypes[backendPriceProvider.contracttype];

            switch (backendPriceProvider.contracttype) {
                case 1: {
                    tariff.flatrate.flatrateRate = backendPriceProvider.priceperhour;
                    break;
                }
                case 2: {
                    tariff.hourly.hourlyRate = backendPriceProvider.priceperkw;
                    tariff.hourly.parkRate = backendPriceProvider.priceperhour;
                    break;
                }
                case 3: {
                    tariff.kwh.kwhRate = backendPriceProvider.priceperkw;
                    tariff.kwh.parkRate = backendPriceProvider.priceperhour;
                }
            }
        }

        if (backendPriceProvider.contracttypewhitelist !== 0) {
            let tariff = frontendPriceProvider.private;
            tariff.active = true;
            tariff.selected = this.priceProviderTariffTypes[backendPriceProvider.contracttypewhitelist];
            tariff.permissions = backendPriceProvider.whitelist;

            switch (backendPriceProvider.contracttypewhitelist) {
                case 1: {
                    tariff.flatrate.flatrateRate = backendPriceProvider.priceperhourwhitelist;
                    break;
                }
                case 2: {
                    tariff.hourly.hourlyRate = backendPriceProvider.priceperkwwhitelist;
                    tariff.hourly.parkRate = backendPriceProvider.priceperhourwhitelist;
                    break;
                }
                case 3: {
                    tariff.kwh.kwhRate = backendPriceProvider.priceperkwwhitelist;
                    tariff.kwh.parkRate = backendPriceProvider.priceperhourwhitelist;
                }
            }
        }

        return frontendPriceProvider;
    }

    toBackendPriceProvider(frontendPriceProvider) {
        let backendPriceProvider = {
            priceperhour: 0,
            priceperkw: 0,
            contracttype: 0,

            priceperhourwhitelist: 0,
            priceperkwwhitelist: 0,
            contracttypewhitelist: 0,

            whitelist: []
        };

        if (frontendPriceProvider.public.active) {
            let tariff = frontendPriceProvider.public;
            let tariffType = this.priceProviderTariffTypes.indexOf(tariff.selected);

            backendPriceProvider.contracttype = tariffType;

            switch (tariffType) {
                case 1: {
                    backendPriceProvider.priceperhour = tariff.flatrate.flatrateRate;
                    break;
                }
                case 2: {
                    backendPriceProvider.priceperkw = tariff.hourly.hourlyRate;
                    backendPriceProvider.priceperhour = tariff.hourly.parkRate;
                    break;
                }
                case 3: {
                    backendPriceProvider.priceperkw = tariff.kwh.kwhRate;
                    backendPriceProvider.priceperhour = tariff.kwh.parkRate;
                    break;
                }
            }
        }

        if (frontendPriceProvider.private.active) {
            let tariff = frontendPriceProvider.private;
            let tariffType = this.priceProviderTariffTypes.indexOf(tariff.selected);

            backendPriceProvider.contracttypewhitelist = tariffType;
            backendPriceProvider.whitelist = tariff.permissions;

            switch (tariffType) {
                case 1: {
                    backendPriceProvider.priceperhourwhitelist = tariff.flatrate.flatrateRate;
                    break;
                }
                case 2: {
                    backendPriceProvider.priceperkwwhitelist = tariff.hourly.hourlyRate;
                    backendPriceProvider.priceperhourwhitelist = tariff.hourly.parkRate;
                    break;
                }
                case 3: {
                    backendPriceProvider.priceperkwwhitelist = tariff.kwh.kwhRate;
                    backendPriceProvider.priceperhourwhitelist = tariff.kwh.parkRate;
                    break;
                }
            }
        }


        return backendPriceProvider;
    }

    atLeastOneTarifSelected() {
        return this.priceprovider.public.active || this.priceprovider.private.active;
    }


    /*
     * checks the weekcalendar whether the connector is open at the time of the request.
     * returns true if the connector is open, false otherwise
     */
    isOpen() {
        let date = new Date();

        // shifts days by one, so mon = 0, tue = 1, ..., sun = 6
        let day = date.getDay() - 1;
        if (day === -1) {
            day = 6;
        }

        let hour = date.getHours();

        return this.weekcalendar.hours[day].from <= hour
            && this.weekcalendar.hours[day].to > hour;
    }

    getTitle() {
        return this.description || this.id;
    }

    serialize(): string {
        return JSON.stringify(this);
    }

    deserialize(input) {
        this.id = input.id;

        this.priceprovider = this.toFrontendPriceProvider(input.priceprovider);
        this.weekcalendar = input.weekcalendar;

        this.metadata = input.metadata;

        this.plugtype = input.plugtype;
        this.maxwattpower = input.maxwattpower;
        this.description = input.description;
        this.isRented = !!input.isrented; // cast to boolean
        this.station = input.station;
        this.timeleft = input.timeleft;
        this.secondstorent = input.secondstorent;

        return this;
    }
}