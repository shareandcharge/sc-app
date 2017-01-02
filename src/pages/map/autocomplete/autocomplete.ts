import {Component, NgZone , ViewChild} from '@angular/core';
import {ViewController} from 'ionic-angular';

declare var google: any;
declare var cordova: any;

@Component({
    templateUrl: 'autocomplete.html'
})
export class AutocompletePage {

    @ViewChild('searchInput') myInput ;

    autocompleteItems: any;
    autocomplete: any;
    service: any;
    // service = new google.maps.places.AutocompleteService();

    constructor(public viewCtrl: ViewController, private zone: NgZone) {
        console.log('Modal const');
        console.log(this.myInput);
        this.service = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };

    }


    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {
        console.log('modal > chooseItem > item > ', item);

        try {
            cordova.plugins.Keyboard.close();
        }
        catch(e) {
            console.log('Hiding keyboard, browser');
        }

        this.viewCtrl.dismiss(item);
    }

    updateSearch() {
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let me = this;
        this.service.getPlacePredictions({
            input: this.autocomplete.query,
            componentRestrictions: {country: 'DE'}
        }, function (predictions, status) {
            console.log('modal > getPlacePredictions > status > ', status);
            me.autocompleteItems = [];
            predictions.forEach(function (prediction) {
                me.autocompleteItems.push(prediction);
            });
        });
    }
}