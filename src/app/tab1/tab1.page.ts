import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { LocalStorageService } from '../local-storage.service';
import { PinataHTTPService } from '../pinata-http.service';
import { Preferences } from '@capacitor/preferences';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  items:any
  constructor(private pinataHTTP: PinataHTTPService, private storage: LocalStorageService ) {

  }

  async ngOnInit() {
    
    //var res = await this.pinataHTTP.getAllKeys()
    //var res = await this.pinataHTTP.generateNewAdminKey()
    //console.log(res)
    this.items=await this.pinataHTTP.getCIDS()
    this.items=this.items.rows
    console.log(this.items[1].ipfs_pin_hash)
    console.log(this.pinataHTTP.getFileByCID(this.items[1].ipfs_pin_hash))
    //ci interssa ipfs_pin_hash
    

  }


}
  


