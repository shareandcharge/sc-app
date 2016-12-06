import {Component} from '@angular/core';
import {NavController, ViewController , ModalController} from 'ionic-angular';
import {StationImageSelectPage} from './image-select-modal'

@Component({
    selector: 'page-add-image',
    templateUrl: 'add-image.html'
})
export class AddStationImagePage {

    constructor(public navCtrl:NavController, private viewCtrl:ViewController , public modalCtrl: ModalController) {
    }

    ionViewDidLoad() {
    }

    skipAddingImage() {
        this.viewCtrl.dismiss();
    }

    AddImage(){
        let modal = this.modalCtrl.create(StationImageSelectPage);
        modal.present();
    }

}
