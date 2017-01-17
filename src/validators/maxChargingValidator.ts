import {FormControl} from '@angular/forms';

export class maxChargingValidator {

    static isValid(control: FormControl): any {

        if (isNaN(control.value)) {
            return {
                "not a number": true
            };
        }

        if (control.value > 200) {
            return {
                "too big": true
            };
        }
        return null;
    }
}