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
 
  changeAuthKey(key:any) {
    this.auth = key
  }

  setPublicKey(key:any){
    this.pinata_api_key = key
  }

  setPrivateKey(key: any) {
    this.pinata_secret_api_key = key
  }

  async tryToAuth(){
    var config = {
      method: 'get',
      url: 'https://api.pinata.cloud/data/testAuthentication',
      headers: { 
        
          'pinata_api_key' : '21355483b71d62be07f0',
          'pinata_secret_api_key':'a200c296d03dea41340442aeac74291645b4d28d9acc63d63537cc727d193dca'
      
        
      }
    };
    
    const res = await axios(config)
    
    console.log(res);
  }

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

  async getAllKeys() {
    var config = {
      method: 'get',
      url: 'https://api.pinata.cloud/users/apiKeys',
      headers: { 
        'pinata_api_key' : this.pinata_api_key,
        'pinata_secret_api_key' : this.pinata_secret_api_key
      }
    };

    return await axios(config)

    
  }

  async getCIDS() {
    var date1 = new Date()
    //TODO CAMBIARE IN PUBLIC KEY DELL'ID DA LEGGERE E NON LA PROPRIA 
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
    //?status=pinned
   
    var response = await axios(config)
    var date1 = new Date()
    console.log (date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds() + "." + date1.getMilliseconds())
    return response.data
  }

  async uploadJSON(fileToUpload: any) {
    //TODO ENCRYPTION
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
  
  async getFileByCID(cid:any){
    return new Promise((resolve)=>{
      this.http.get('https://ipfs.io/ipfs/'+cid).subscribe({
        next:async data=>{
          resolve(data)
        }
      })
    })
  }
  
    
}
