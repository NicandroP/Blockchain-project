import { Component } from '@angular/core';
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


  clickUpload() {

    console.log("VALORE 1 = ", this.valore1)
    console.log("VALORE 2 = ", this.valore2)
    
    var JSONToUpload = this.createJSON()
    console.log(this.pinataHTTP.uploadJSON(JSONToUpload))


  }


  createJSON() {
    var JSONToUpload = ""
    JSONToUpload = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 1
      },
      "pinataMetadata": {
        "name": "testing",
        "keyvalues": {
          "customKey": "customValue"
          
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

