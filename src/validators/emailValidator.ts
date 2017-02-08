import {FormControl} from '@angular/forms';

export class emailValidator {


    static isValid(control: FormControl): any {

        let emailRegex = new RegExp(/^.+@\S+\.\S+$/);

        if (!emailRegex.test(control.value)) {
            return {
                "not valid email": true
            };
        }
        return null;
    }
}

