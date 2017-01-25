import {FormControl} from '@angular/forms';

export class termsValidator {

    static isValid(action: string): any {
        return (control: FormControl) => {
            // only check the terms if a user wants to sign up
            if (action !== 'signUp') {
                return null;
            }

            if (control.value == false) {
                return {
                    "not selected": true
                };
            }
            return null;
        }
    }
}