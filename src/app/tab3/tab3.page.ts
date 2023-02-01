import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  pubKey:any
  password:any
  constructor() {}
  async ngOnInit(){
    
    this.pubKey=(await Preferences.get({key:"PublicKey"})).value
    this.password=(await Preferences.get({key:"Password"})).value
  }


}
