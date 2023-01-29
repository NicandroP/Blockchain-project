import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { PinataHTTPService } from '../pinata-http.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  valore1=""
  valore2= ""
  readOnlyMode = true
  constructor(private pinataHTTP: PinataHTTPService) {}


  async clickUpload() {

    console.log("VALORE 1 = ", this.valore1)
    console.log("VALORE 2 = ", this.valore2)
    
    var JSONToUpload =await this.createJSON()
    console.log(JSONToUpload)
    console.log(this.pinataHTTP.uploadJSON(JSONToUpload))


  }
  

  async createJSON() {
    var pKey=await Preferences.get({key:'PublicKey'})
    var date=new Date()
    var name=pKey.value+" ,"+date.getFullYear()+" "+date.getMonth()+1+" "+date.getDate()+":"+date.getHours() + ":" + date.getMinutes()+" "+date.getSeconds()
    console.log(name)
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
      "pinataContent": {
        "valore1": this.valore1,
        "valore2" : this.valore2
      }
    });

    return JSONToUpload
  }
}

