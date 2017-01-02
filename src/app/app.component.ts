import { Component } from '@angular/core';
import {Platform, Events} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, private authService: AuthService, private userService: UserService, private events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.checkExistingToken();
    });
  }


  checkExistingToken() {
    this.events.subscribe('auth:refresh:user', () => this.refreshUser());
    this.authService.checkExistingToken();
  }

  refreshUser() {
    this.userService.getUser().subscribe((user) => this.authService.setUser(user));
  }

}
