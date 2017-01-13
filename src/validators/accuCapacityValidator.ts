import {FormControl} from '@angular/forms';

export class accuCapacityValidator {
    static isValid(control: FormControl): any {

        if (isNaN(control.value)) {
            return {
                "not a number": true
            };
        }

        if (control.value > 150) {
            return {
                "too big": true
            };
        }

        return null;
    }
}