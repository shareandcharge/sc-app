import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'password-strength-bar',
    templateUrl: 'password-strength-bar.html',
    inputs: ['password']
})
export class PasswordStrengthBarComponent {
    /* we don't add "password" here, otherwise we can't use it as a set'ter function */
    @Input('minLength') minLength;

    @Output()
    change: EventEmitter<any> = new EventEmitter<any>();

    score: number = 0;
    strength: number = 0;
    label: string = '';

    labels: any = {};

    constructor(private translateService: TranslateService) {
        this.labels = {
            0: '',
            1: this.translateService.instant('password_strength.too_short'),
            2: this.translateService.instant('password_strength.weak'),
            3: this.translateService.instant('password_strength.good'),
            4: this.translateService.instant('password_strength.strong'),
            5: this.translateService.instant('password_strength.ultra_strong')
        }
    }

    set password(value) {
        this.score = this.calcScore(value);
        this.strength = this.getStrength(this.score);
        this.label = this.labels[this.strength];

        this.change.emit({
            score: this.score,
            strength: this.strength
        });
    }

    calcScore(pass): number {
        let score: number = 0;
        if (!pass) return -1;

        if (this.minLength && pass.length < this.minLength) {
            return 0;
        }

        //-- points for unique letters up to 5 repetitions
        let letters = {};
        for (let i = 0; i < pass.length; i++) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]];
        }

        //-- points for having mixed chars
        const variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        };

        let variationCount = 0;
        for (let check in variations) {
            variationCount += (variations[check] == true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;

        return Math.round(score);
    }

    getStrength(score) {
        if (score > 100)
            return 5;       // ultra strong
        if (score > 80)
            return 4;       // strong
        if (score > 60)
            return 3;       // good
        if (score >= 30)
            return 2;       // weak
        if (score >= 0)
            return 1;       // too weak/short

        return 0;       // empty
    }

}