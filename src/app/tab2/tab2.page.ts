import { Component,OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { type } from 'os';
import { PinataHTTPService } from '../pinata-http.service';
import * as crypto from 'crypto-js';
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
  constructor(private pinataHTTP: PinataHTTPService) {}
  
  async ngOnInit() {
    let appMode=await Preferences.get({key:"AppMode"})
    if(appMode.value=="writer"){
      this.readOnlyMode=false
    }else{
      this.readOnlyMode=true
    }
  }


  async clickUpload() {

    console.log("Altezza = ", this.altezza)
    console.log("Peso = ", this.peso)
    console.log("Età = ", this.eta)
    console.log("Pressione mix = ", this.pressioneMin)
    console.log("Pressione max = ", this.pressioneMax)
    var JSONToUpload =await this.createJSON()

    //var bytes = crypto.AES.decrypt(encrypted.toString(), pw);
    //var plaintext = bytes.toString(crypto.enc.Utf8);
    //console.log(plaintext);
    
    console.log(this.pinataHTTP.uploadJSON(JSONToUpload))

    this.altezza=""
    this.peso=""
    this.eta=""
    this.pressioneMin=""
    this.pressioneMax=""

  }
  
  async createJSON() {
    var pKey=await Preferences.get({key:'PublicKey'})
    var password=await Preferences.get({key:'Password'})
    var pw=password.value+""
    
    
    var date=new Date()
    var name=pKey.value+", "+date.getDate()+"/"+(parseInt(String(date.getMonth()))+1)+"/"+date.getFullYear()+", "+date.getHours() + ":" + date.getMinutes()+":"+date.getSeconds()
    
    var content=""
    content=JSON.stringify({
      "altezza": this.altezza,
      "peso" : this.peso,
      "eta" : this.eta,
      "pressioneMin" : this.pressioneMin,
      "pressioneMax" : this.pressioneMax,
      "data" : date.getDate()+"/"+(parseInt(String(date.getMonth()))+1)+"/"+date.getFullYear()+", "+date.getHours() + ":" + date.getMinutes()+":"+date.getSeconds()
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

