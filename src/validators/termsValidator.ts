import {FormControl} from '@angular/forms';

export class termsValidator {

    static isValid(control: FormControl): any {

        if (control.value == false) {
            return {
                "not selected": true
            };
        }
        return null;
    }
}