import { Component } from '@angular/core';

import { MapPage } from '../map/map';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { SignupPage } from '../signup/signup';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = MapPage;
  tab2Root: any = ContactPage;
  tab3Root: any = SignupPage;
  tab4Root: any = AboutPage;

  constructor() {

  }
}
