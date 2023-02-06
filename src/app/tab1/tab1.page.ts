import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { LocalStorageService } from '../local-storage.service';
import { PinataHTTPService } from '../pinata-http.service';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import * as crypto from 'crypto-js';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  array:any
  constructor(private alertController: AlertController,private pinataHTTP: PinataHTTPService, private storage: LocalStorageService ) {

  }

  async ngOnInit() {
     
  }
  async ionViewWillEnter() {
    this.array=new Array()
    const urls = await this.pinataHTTP.getCIDS()
    for (let i = 0; i<urls.count; i++){
      let url = urls.rows[i].ipfs_pin_hash

      var config = {
        method: 'get',
        url: "https://gateway.pinata.cloud/ipfs/"+url,
        headers: { 
          'Accept': 'text/plain'
        }
      };

      let response=await axios(config).then(async response=>{
        console.log(response.data.encryptedString)
        var password=await Preferences.get({key:'Password'})
        var pw=password.value+""
        var bytes = crypto.AES.decrypt(response.data.encryptedString, pw);//QUI VA GESTITO CHE SE LA PW É INCORRETTA BISOGNA GENERARE UN ERRORE
        var plaintext = bytes.toString(crypto.enc.Utf8);
        var jsonPlaintext=JSON.parse(plaintext)
        console.log(jsonPlaintext);
        this.array.push(jsonPlaintext)
      }).catch(error=>{
        console.log(error)
      })
      
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
  


