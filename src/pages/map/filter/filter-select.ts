import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FilterPlugtypesPage} from "./filter-plugtypes";
import {FilterCommercialCategoryPage} from "./filter-commercial-category";
import {CurrencyService} from "../../../services/currency.service";


@Component({
    selector: 'page-filter-select',
    templateUrl: 'filter-select.html'
})
export class FilterSelectPage {

    toggledPlugs: Array<any>;
    filterForCommercialCategory: Array<any>;
    setFilter: any;
    hideCommercialOption: boolean = false;


    constructor(private navCtrl: NavController, private navParams : NavParams, private currencyService: CurrencyService) {
        this.toggledPlugs = this.navParams.get('toggledPlugs');
        this.filterForCommercialCategory = this.navParams.get('filterForCommercialCategory');
        this.setFilter = this.navParams.get('setFilter');
        this.hideCommercialOption = this.currencyService.isCommercialOptionHidden();
    }

    ionViewWillEnter() {
    }

    openFilterPlugtypes() {
        this.navCtrl.push(FilterPlugtypesPage, {
            toggledPlugs: this.toggledPlugs,
            setPlugtypes: this.setPlugtypes
        });
    }

    openFilterCommercialCategory() {
        this.navCtrl.push(FilterCommercialCategoryPage, {
            filterForCommercialCategory: this.filterForCommercialCategory,
            setCommercialCategory: this.setCommercialCategory
        });
    }

    setPlugtypes = (plugtypes) => {
        this.toggledPlugs = plugtypes;
    };

    setCommercialCategory = (commercialCategory) => {
        this.filterForCommercialCategory = commercialCategory;
    };


    dismiss() {
        this.setFilter(this.toggledPlugs, this.filterForCommercialCategory);

        this.navCtrl.parent.pop();
    }
}
