import {Component} from '@angular/core'
import {AddCarPage} from "./add/add-car";

@Component({
    selector: 'page-car-wrapper',
    templateUrl: 'car-wrapper.html',
})
export class CarWrapperPage {
    rootPage = AddCarPage;
}