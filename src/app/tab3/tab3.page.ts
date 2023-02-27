import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  appMode: any
  publicKey: any
  privateKey: any
  password: any
  writerPublicKey: any
  writer:any
  constructor() {}

  async ngOnInit(){}
  //Recupero variabili per la visualizzazione a front-end per la visualizzare delle informazioni del nodo
  async ionViewWillEnter() {
    this.appMode = await Preferences.get({key:"AppMode"})

    if (this.appMode.value  == "reader") {
      this.writer=false
      this.writerPublicKey = await (await Preferences.get({key:"WriterPublicKey"})).value
      this.password = await (await Preferences.get({key:"Password"})).value

    } else {
      this.writer=true
      this.publicKey = await (await Preferences.get({key:"PublicKey"})).value
      this.privateKey = await (await Preferences.get({key:"PrivateKey"})).value
      this.password = await (await Preferences.get({key:"Password"})).value
    }

    

  }
  
  async logoutButton() {
    await Preferences.clear()
    window.location.replace('/')
    

  }


}
