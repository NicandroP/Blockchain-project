import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { LocalStorageService } from '../local-storage.service';
import { PinataHTTPService } from '../pinata-http.service';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  items:any
  item:any
  array:any
  constructor(private alertController: AlertController,private pinataHTTP: PinataHTTPService, private storage: LocalStorageService ) {

  }

  async ngOnInit() {
     
  }
  async ionViewWillEnter() {
    const urls = await this.pinataHTTP.getCIDS()
    console.log(urls.data.rows)
    for (let i = 0; i<urls.data.count; i++){
      let urll = urls.data.rows[i].ipfs_pin_hash

      var config = {
        method: 'get',
        url: "https://gateway.pinata.cloud/ipfs/"+urll,
        headers: { 
          'Accept': 'text/plain'
        }
      };

      console.log(await axios(config))
    }
  }
  async showCardDetails(data:any,altezza:any,peso:any,eta:any,pressioneMin:any,pressioneMax:any){
    const alert = await this.alertController.create({
      header: data,
      subHeader: altezza,
      message:peso+" "+eta+" "+pressioneMin+" "+pressioneMax
    })
    await alert.present();
    await alert.onDidDismiss();

  }

}
  


