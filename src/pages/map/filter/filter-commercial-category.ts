import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {User} from "../../../models/user";


@Component({
    templateUrl: 'filter-commercial-category.html',
    selector: 'filter-commercial-category-page'
})
export class FilterCommercialCategoryPage {
    setCommercialCategory: any;
    filterForCommercialCategory: Array<any>;

    types = [
        {
            title: 'private',
            icon: 'cust-private-station',
            key: User.COMMERCIAL_CATEGORY_PRIVATE,
            on: false
        },
        {
            title: 'hotel',
            icon: 'cust-hotel',
            key: User.COMMERCIAL_CATEGORY_HOTEL,
            on: false
        },
        {
            title: 'restaurant',
            icon: 'cust-restaurant',
            key: User.COMMERCIAL_CATEGORY_RESTAURANT,
            on: false
        }
    ];

    constructor(public viewCtrl: ViewController, private navParams: NavParams) {
        this.filterForCommercialCategory = this.navParams.get('filterForCommercialCategory');
        this.setCommercialCategory = this.navParams.get('setCommercialCategory');

        this.types.forEach((type) => {
            type.on = this.filterForCommercialCategory.indexOf(type.key) !== -1
        });
    }

    dismiss() {
        this.filterForCommercialCategory = [];
        this.types.forEach((type) => {
            if (type.on) this.filterForCommercialCategory.push(type.key);
        });

        this.setCommercialCategory(this.filterForCommercialCategory);

        this.viewCtrl.dismiss();
    }
}