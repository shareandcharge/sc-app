import {Component, ViewChild} from '@angular/core';
import {ViewController, Searchbar} from 'ionic-angular';

declare var google: any;
declare var cordova: any;

@Component({
    templateUrl: 'autocomplete.html'
})
export class AutocompletePage {

    autocompleteItems: any;
    service: any;

    @ViewChild(Searchbar) searchbar: Searchbar;

    constructor(public viewCtrl: ViewController) {
        this.service = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {
        try {
            cordova.plugins.Keyboard.close();
        }
        catch (e) {
            // console.log('Hiding keyboard, browser');
        }

        this.viewCtrl.dismiss(item);
    }

    updateSearch(ev: any) {
        let val = ev.target.value;

        if (!val || val.trim() == '') {
            this.autocompleteItems = [];
            return;
        }

        this.service.getPlacePredictions({
            input: val,
            componentRestrictions: {country: 'DE'}
        }, (predictions, status) => {
            let places = [];

            if ('OK' === status) {
                predictions.forEach(function (prediction) {
                    places.push(prediction);
                });
            }

            this.autocompleteItems = places;
        });
    }
}