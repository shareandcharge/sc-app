import {FormControl} from '@angular/forms';

/**
 * @deprecated as we're going international we decided to just check for number of characters, don't limit to only numbers.
 */
export class postalCodeValidator {

    static isValid(control: FormControl): any {

        if (isNaN(control.value)) {
            return {
                "not a number": true
            };
        }
        if (control.value % 1 !== 0) {
            return {
                "not a whole number": true
            };
        }
        return null;
    }
}