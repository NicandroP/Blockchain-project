import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  writerMode:any
  constructor() {
    this.appMode()
  }
  async appMode(){
    let appMode=await Preferences.get({key:"AppMode"})
    if(appMode.value=="writer"){
      this.writerMode=true
    }else{this.writerMode=false}
  }

}
