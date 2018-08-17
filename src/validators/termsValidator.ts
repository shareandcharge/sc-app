import {FormControl} from '@angular/forms';

export class termsValidator {

    static isValid(control: FormControl) {
        if (control.value == false) {
            return {
                "not selected": true
            };
        }
        return null;
    }
}