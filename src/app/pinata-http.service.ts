import { Injectable, OnInit } from '@angular/core';
import axios from 'axios';
import {Preferences} from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { from, Observable, timeout } from 'rxjs';

 
@Injectable({
  providedIn: 'root'
})
export class PinataHTTPService  {
  data:any
  auth = ""
  pinata_api_key: any
  pinata_secret_api_key: any

  constructor(private http: HttpClient) {
    
  }

  setPublicKey(key:any){
    this.pinata_api_key = key
  }

  setPrivateKey(key: any) {
    this.pinata_secret_api_key = key
  }

  //Generazione nuova chiave scrittore tramite API Pinata
  async generateNewAdminKey() {
    
    var data = JSON.stringify({
      "keyName": "My Key",
      
      "permissions": {
        
        "endpoints": {
          "data": {
            "pinList": true,
            "userPinnedDataTotal": true
          },
          "pinning": {
            "hashMetadata": true,
            "hashPinPolicy": true,
            "pinByHash": true,
            "pinFileToIPFS": true,
            "pinJSONToIPFS": true,
            "pinJobs": true,
            "unpin": true,
            "userPinPolicy": true
          }
        }
      }
    });

    var config = {
      method: 'post',
      url: 'https://api.pinata.cloud/users/generateApiKey',
      headers: { 
        'pinata_api_key' : this.pinata_api_key,
        'pinata_secret_api_key' : this.pinata_secret_api_key,
        'Content-Type': 'application/json'
      },
      data : data
    };
    console.log(config)
    const res = await axios(config);

    return res.data

  }

  //Recupero di tutte le cids, filtrate utilizzando la public key del writer
  async getCIDS() {
    var date1 = new Date()
    var appMode = await Preferences.get({key:'AppMode'})
    var writerPubKey
    if (appMode.value == "reader") {
       writerPubKey = await Preferences.get({key:'WriterPublicKey'})
    } else {
      writerPubKey = await Preferences.get({key:'PublicKey'})
    }
    
      
    
    console.log(writerPubKey)
    console.log(this.pinata_api_key)
    console.log(this.pinata_secret_api_key)
    console.log (date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds() + "." + date1.getMilliseconds())
    var config = {
      method: 'get',
      url: 'https://api.pinata.cloud/data/pinList?status=pinned&metadata[keyvalues][customKey]={"value":"'+writerPubKey.value+'", "op":"eq"}',
      headers: {
        'pinata_api_key' : this.pinata_api_key,
        'pinata_secret_api_key' : this.pinata_secret_api_key
      }
    
    };
   
    var response = await axios(config)
    var date1 = new Date()
    console.log (date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds() + "." + date1.getMilliseconds())
    return response.data
  }

  //Caricamento file su Pinata
  async uploadJSON(fileToUpload: any) {
    var config = {
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      headers: {
        'Content-Type':'application/json',
        'pinata_api_key' : this.pinata_api_key,
        'pinata_secret_api_key' : this.pinata_secret_api_key
      },
      data: fileToUpload
    }
    console.log(config)
    
    return await axios(config)
  }
  
  //Rimozione file da Pinata
  async removeFile(fileToRemove:any){
    var config = {
      method: 'delete',
      url: 'https://api.pinata.cloud/pinning/unpin/'+fileToRemove,
      headers: { 
        'pinata_api_key' : this.pinata_api_key,
        'pinata_secret_api_key' : this.pinata_secret_api_key
      }
    };
    
    const res = await axios(config);
    console.log("File deleted: "+res.data)
  }
    
}
