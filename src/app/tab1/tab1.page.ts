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
  item:any
  array:any
  constructor(private pinataHTTP: PinataHTTPService, private storage: LocalStorageService ) {

  }

  async ngOnInit() {
     
  }
  async ionViewWillEnter() {
    this.items=await this.pinataHTTP.getCIDS()
    this.items=this.items.rows
    console.log("files pinnati su pinata: "+this.items.length)
    this.array=new Array()
    console.log(this.items)
    for(let i=0;i<this.items.length;i++){
      this.item=await this.pinataHTTP.getFileByCID(this.items[i].ipfs_pin_hash)
      this.array.push(this.item)                                                                            
    }
    console.log(this.array)
  }

}
  


