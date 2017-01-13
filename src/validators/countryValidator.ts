import {FormControl} from '@angular/forms';

export class countryValidator {

    static isValid(control: FormControl): any {
        if (control.value.length == 0) {
            return {
                "empty": true
            };
        }
        return null;
    }
}