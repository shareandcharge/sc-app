import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'password-strength-bar',
    templateUrl: 'password-strength-bar.html',
    inputs: ['password']
})
export class PasswordStrengthBarComponent {

    @Output()
    change: EventEmitter<any> = new EventEmitter<any>();

    score: number = 0;
    strength: number = 0;
    label: string = '';

    labels: any = {};

    constructor() {
        this.labels = {
            0: '',
            1: 'too short',
            2: 'weak',
            3: 'good',
            4: 'strong',
            5: 'ultra strong'
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