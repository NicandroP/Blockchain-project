import { Injectable, OnInit } from '@angular/core';
import axios from 'axios';
import {Preferences} from '@capacitor/preferences';
import {create} from 'ipfs-http-client';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class PinataHTTPService  {
  
  //AUTH CHIAVE ADMIN 1
  //auth = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmJmNzhjYS04N2Y4LTQzNjctYTcyMi0yZWZiZTQ1ZWM2ODEiLCJlbWFpbCI6InByb2plY3RibG9ja2NoYWluMjAyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGYxNzE1ZTdlMTU0ZWYzM2NlNzAiLCJzY29wZWRLZXlTZWNyZXQiOiI3NDM1YWZmNjY4NmUzOWYyNmNmOGU1MmQ4YjE1NWE4YjFkNTc1ZTM5OWI2NDEwNGIzMDkxYjhiZGU3NzM1MTU4IiwiaWF0IjoxNjc0NTU3ODEyfQ.ZBC2rQPDgbLx3jvo1BT2wpREFOWcV92W4n0gbz3XIa0"
  auth = ""
  //AUTH CHIAVE ADMIN 2
  //auth = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmJmNzhjYS04N2Y4LTQzNjctYTcyMi0yZWZiZTQ1ZWM2ODEiLCJlbWFpbCI6InByb2plY3RibG9ja2NoYWluMjAyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZmM4ODhmMDkyNWY2NTY2ZDM5NWYiLCJzY29wZWRLZXlTZWNyZXQiOiJhMWIwODIzNDA2YzU4ODMzMzY4MWU3ZmM0YzMxMzlkYjMzOTAyNTgwMDdhOGMzMDBjNzUxMzc2OWYzZDgxYjQxIiwiaWF0IjoxNjc0OTAzNDQzfQ.7t0VRu_ys3hb5kQF7WuXX2SliqG98GV5jyn1wtmBeSk"
  
  constructor(private http: HttpClient) {
    
  }

  changeAuthKey(key:string) {
    this.auth = key
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
        'Authorization': this.auth, 
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
        'Authorization': this.auth
      }
    };

    return await axios(config)

    
  }

  async getCIDS() {
    var date1 = new Date()
    var pubKey= await Preferences.get({key:'PublicKey'})
    console.log (date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds() + "." + date1.getMilliseconds())
    var config = {
      method: 'get',
      url: 
      'https://api.pinata.cloud/data/pinList?status=pinned&metadata[keyvalues][customKey]={"value":"'+pubKey.value+'", "op":"eq"}',
      headers: {
        'Authorization': this.auth
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
        'Authorization': this.auth
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
