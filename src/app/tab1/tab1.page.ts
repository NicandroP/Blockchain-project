import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { LocalStorageService } from '../local-storage.service';
import { PinataHTTPService } from '../pinata-http.service';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import * as crypto from 'crypto-js';
import moment from 'moment';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  erroreHttp=false
  tempArray:any
  array:any
  elements=false
  isLoading=false
  storedCids:any
  newCids:any
  filterValue:any
  filterIsActive=false
  constructor(private alertController: AlertController,private pinataHTTP: PinataHTTPService, private storage: LocalStorageService ) {

  }

  async ngOnInit() {
    this.array=new Array()
    this.storedCids=new Array()
    await Preferences.set({key: "storedCids", value:this.storedCids})
    await Preferences.set({key: "pinnedFiles", value:"0"})
    
  }

  async ionViewWillEnter() {
    
    this.newCids=new Array()
    const urls = await this.pinataHTTP.getCIDS()

    let elementCount=urls.count
    console.log("Files pinnati su pinata: "+elementCount)
    await Preferences.set({key: "pinnedFiles", value:elementCount})
    if(elementCount>0){this.elements=true}else{this.elements=false}

    //page 1 doesnt refresh by mooving between tabs if files didn't change
    for(let i=0;i<urls.count;i++){
      this.newCids.push(urls.rows[i].ipfs_pin_hash)
    }
    let storedCids=await Preferences.get({key: "storedCids"})
    let storedCids2
    if(storedCids.value==''){
      storedCids2=[]
    }else{
      storedCids2=storedCids.value?.split(",")
    }
    if(this.arraysEqual(storedCids2,this.newCids)){
      console.log("cids uguali")
      
    }else{
      console.log("cids diversi")
      this.array=[]
      await Preferences.set({key: "storedCids", value:this.newCids})
      this.isLoading=true
      for (let i = urls.count-1; i>=0; i--){
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
          var bytes = crypto.AES.decrypt(response.data.encryptedString, pw);
          var plaintext = bytes.toString(crypto.enc.Utf8);
          var jsonPlaintext=JSON.parse(plaintext)
          console.log(jsonPlaintext);
          jsonPlaintext.cid=url
          this.array.unshift(jsonPlaintext)
          this.erroreHttp=false
          
        }).catch(async error=>{
          console.log("ERRORE: "+error)
          this.erroreHttp=true
          this.elements=false
          await Preferences.set({key: "pinnedFiles", value:"0"})
          await Preferences.set({key: "storedCids",value:""})
        })
      
      }
      this.tempArray=this.array
      this.isLoading=false
      console.log("chiamata axios terminata")
    }
       
    
  }

  arraysEqual(a:any, b:any) {
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    if (a === b) return true;
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  async showCardDetails(data:any,altezza:any,peso:any,eta:any,pressioneMin:any,pressioneMax:any,glucose:any,cid:any){
    let appMode=await Preferences.get({key: "AppMode"})
    if(appMode.value=="writer"){
      const alert = await this.alertController.create({
        header: data,
        message:"Heigth: " +altezza+"<br>Weigth: "+peso+"<br>Age: "+eta+"<br>Min pressure: "+pressioneMin+"<br>Max pressure: "+pressioneMax+"<br>Glucose: "+glucose,
        buttons: [
          {
            text: 'Delete',
            handler: async () => {
              await this.pinataHTTP.removeFile(cid)
              this.ionViewWillEnter()
            }
          }
        ]
      })
      await alert.present();
      await alert.onDidDismiss();
    }else{
      const alert = await this.alertController.create({
        header: data,
        message:"Heigth: " +altezza+"<br>Weigth: "+peso+"<br>Età: "+eta+"<br>Min pressure: "+pressioneMin+"<br>Max pressure: "+pressioneMax+"<br>Glucose: "+glucose,
      })
      await alert.present();
      await alert.onDidDismiss();
    }
   
  }

  async removeSelection(){
    this.filterIsActive=false
    this.filterValue=null
    console.log("Removed filter")
    this.tempArray=this.array
    console.log(this.tempArray)
  }
  async reload(){
    window.location.reload()
  }
  async onChange(){
    let value=this.filterValue
    if(this.filterValue=="lastDay" || this.filterValue=="lastWeek" || this.filterValue=="lastMonth"){
      this.filterIsActive=true
      
      console.log("Filtering file by: "+this.filterValue)
      
      var currentTime = new Date();
      var formattedCurrentTime = moment(currentTime).format('YYYYMMDD');
      
      var newArray = this.array.filter(function (el:any) {
        let dataProva=new Date("01-01-2023")
        let data=el.data.split(",")[0]
        let data2=new Date(data.split("/")[1]+"-"+data.split("/")[0]+"-"+data.split("/")[2])
        var data2Formatted=moment(data2).format('YYYYMMDD');
        if(value=='lastDay'){
          return data2Formatted==formattedCurrentTime
        }
        if(value=="lastWeek"){
          let lastWeekDate=new Date()
          lastWeekDate.setDate(lastWeekDate.getDate() - 7);
          var lastWeekFormattedDate=moment(lastWeekDate).format('YYYYMMDD');
          
          return data2Formatted >= lastWeekFormattedDate && data2Formatted<=formattedCurrentTime
        }else{
          let lastMonthDate=new Date()
          lastMonthDate.setDate(lastMonthDate.getDate() - 31);
          var lastMonthFormattedDate=moment(lastMonthDate).format('YYYYMMDD');
          return data2Formatted >= lastMonthFormattedDate && data2Formatted<=formattedCurrentTime
        }
        
      });
    }
    if(value!=undefined){
      this.tempArray=newArray
      console.log(this.tempArray)
    }
    
  }

}
  


