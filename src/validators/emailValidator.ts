import {FormControl} from '@angular/forms';

export class emailValidator {


    static isValid(control: FormControl): any {

        let emailRegex = new RegExp(/^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/);

        if (!emailRegex.test(control.value)) {
            return {
                "not valid email": true
            };
        }
        return null;
    }
}

