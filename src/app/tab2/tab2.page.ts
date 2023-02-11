import { Component,OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { type } from 'os';
import { PinataHTTPService } from '../pinata-http.service';
import * as crypto from 'crypto-js';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  altezza=""
  peso= ""
  eta= ""
  pressioneMin= ""
  pressioneMax= ""
  readOnlyMode = false
  constructor(private pinataHTTP: PinataHTTPService,private alertController: AlertController) {}
  
  async ngOnInit() {
    let appMode=await Preferences.get({key:"AppMode"})
    if(appMode.value=="writer"){
      this.readOnlyMode=false
    }else{
      this.readOnlyMode=true
    }
  }


  async clickUpload() {
    if(this.altezza=='' || this.peso=='' || this.eta=='' || this.pressioneMin=='' || this.pressioneMax==''){
      const alert = await this.alertController.create({
        message:"Insert all values"
      })
      await alert.present();
      await alert.onDidDismiss();
    }else{
      console.log("Altezza = ", this.altezza)
      console.log("Peso = ", this.peso)
      console.log("Età = ", this.eta)
      console.log("Pressione mix = ", this.pressioneMin)
      console.log("Pressione max = ", this.pressioneMax)
      var JSONToUpload =await this.createJSON()
  
      //var bytes = crypto.AES.decrypt(encrypted.toString(), pw);
      //var plaintext = bytes.toString(crypto.enc.Utf8);
      //console.log(plaintext);
      
      const loading = await this.alertController.create({
        message:"Uploading"
      })
      loading.present()
      console.log((await this.pinataHTTP.uploadJSON(JSONToUpload)).status)
      loading.dismiss()
      console.log("loading closed")

      this.altezza=""
      this.peso=""
      this.eta=""
      this.pressioneMin=""
      this.pressioneMax=""
    }

    

  }
  
  async createJSON() {
    var pKey=await Preferences.get({key:'PublicKey'})
    var password=await Preferences.get({key:'Password'})
    var pw=password.value+""
    
    //displaying data in better way by adding 0 to 1 length values
    var date=new Date()
    var day=date.getDate().toString()
    if(day.length==1){day="0"+day}
    var month=date.getMonth()+1
    let monthString=month.toString()
    if(monthString.length==1){monthString="0"+monthString}
    var hours=date.getHours().toString()
    if(hours.length==1){hours="0"+hours}
    var minutes=date.getMinutes().toString()
    if(minutes.length==1){minutes="0"+minutes}
    var seconds=date.getSeconds().toString()
    if(seconds.length==1){seconds="0"+seconds}

    var date2=day+"/"+monthString+"/"+date.getFullYear()+", "+hours + ":" + minutes+":"+seconds
    var name=pKey.value+", "+date2
    
    var content=""
    content=JSON.stringify({
      "altezza": this.altezza,
      "peso" : this.peso,
      "eta" : this.eta,
      "pressioneMin" : this.pressioneMin,
      "pressioneMax" : this.pressioneMax,
      "data" : date2
    })
    var encrypted = crypto.AES.encrypt(content.toString(), pw);
    var encryptedString=encrypted.toString()
    console.log(encryptedString)
    
    var JSONToUpload = ""
    JSONToUpload = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 1
      },
      "pinataMetadata": {
        "name": name,
        "keyvalues": {
          "customKey": pKey.value
        }
      },
      "pinataContent":{
        encryptedString
      }
    });

    return JSONToUpload
  }
  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

}

