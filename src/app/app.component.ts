import { Component, OnInit } from '@angular/core';
import {Preferences} from '@capacitor/preferences'
import { AlertController } from '@ionic/angular';
import { PinataHTTPService } from './pinata-http.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  showTabs = false
  constructor(private alertController: AlertController, private pinataHTTP: PinataHTTPService) {
    
  }
  async ngOnInit(){
    //Preferences.clear()
    this.firstRun()
      
  }
  async firstRun() {
    
    
    //Preferences.set({key:"firstRun",value: "true"})
    const key = await Preferences.get({key:"Auth"})
    if (key.value == null) {
      await Preferences.set({key:"Auth", value:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmJmNzhjYS04N2Y4LTQzNjctYTcyMi0yZWZiZTQ1ZWM2ODEiLCJlbWFpbCI6InByb2plY3RibG9ja2NoYWluMjAyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGYxNzE1ZTdlMTU0ZWYzM2NlNzAiLCJzY29wZWRLZXlTZWNyZXQiOiI3NDM1YWZmNjY4NmUzOWYyNmNmOGU1MmQ4YjE1NWE4YjFkNTc1ZTM5OWI2NDEwNGIzMDkxYjhiZGU3NzM1MTU4IiwiaWF0IjoxNjc0NTU3ODEyfQ.ZBC2rQPDgbLx3jvo1BT2wpREFOWcV92W4n0gbz3XIa0"})
      this.pinataHTTP.changeAuthKey("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmJmNzhjYS04N2Y4LTQzNjctYTcyMi0yZWZiZTQ1ZWM2ODEiLCJlbWFpbCI6InByb2plY3RibG9ja2NoYWluMjAyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGYxNzE1ZTdlMTU0ZWYzM2NlNzAiLCJzY29wZWRLZXlTZWNyZXQiOiI3NDM1YWZmNjY4NmUzOWYyNmNmOGU1MmQ4YjE1NWE4YjFkNTc1ZTM5OWI2NDEwNGIzMDkxYjhiZGU3NzM1MTU4IiwiaWF0IjoxNjc0NTU3ODEyfQ.ZBC2rQPDgbLx3jvo1BT2wpREFOWcV92W4n0gbz3XIa0")
    } else {
      this.pinataHTTP.changeAuthKey(key.value)
    }
    //console.log(await Preferences.get({key:"Auth"}))

    //Preferences.set({key:"firstRun",value: "true"})
    let firstRun = await Preferences.get({key: "firstRun"})
    console.log(firstRun.value)
    
    if (firstRun.value == "true") {
      
      this.showTabs = false
      const alert = await this.alertController.create({
        header: 'Benvenuto!',
        subHeader: 'Sei uno scrittore o un lettore?',
        buttons:[
          {
            text: 'Scrittore',
            handler: () => {       
              Preferences.set({key:"AppMode", value:"writer"})
              console.log(Preferences.get({key:"AppMode"}))
            },
          },
          {
            text:'Lettore',
            handler: () => {
              Preferences.set({key:"AppMode", value:"reader"})
              console.log(Preferences.get({key:"AppMode"}))
            },
          }
        ]


      })
      await alert.present();
      await alert.onDidDismiss();

      const appMode = await Preferences.get({key: "AppMode"})
      if (appMode.value == "writer") {
        const newKey = await this.pinataHTTP.generateNewAdminKey()
        console.log(newKey)
        Preferences.set({key:"Auth",value: "Bearer "+newKey.JWT})
        Preferences.set({key: "PublicKey", value: newKey.pinata_api_key})
        let password = this.crea_password()
        Preferences.set({key: "Password", value: password})
        //TODO GENERATORE PASSWORD E SALVARLA IN DB LOCALE
        const alert = await this.alertController.create({
          header: "SALVA INFORMAZIONI KEY",
          subHeader: "",
          message: "La tua chiave pubblica da fornire ai lettori è: " + newKey.pinata_api_key + "<br> La tua password è: " + password,
          buttons:[{text:"OK"}]
        })
        await alert.present();
        
        
      } else {
        Preferences.set({key:"Auth", value : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmJmNzhjYS04N2Y4LTQzNjctYTcyMi0yZWZiZTQ1ZWM2ODEiLCJlbWFpbCI6InByb2plY3RibG9ja2NoYWluMjAyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYTNiYjc1MGNhNjU0NWRhMmNhYWEiLCJzY29wZWRLZXlTZWNyZXQiOiJkMzQ4YzI1MTg4YjAyYjAwMjI5NTMyMTcwNTM2YTFhYmM3MjEwYzA2ZDM1YjVjNDA4MDcxMjI2YTMxZGI1YTVkIiwiaWF0IjoxNjc0OTI2MDE3fQ.x2b7Ug5Lz79Gc_FBM50FiQ2nxZ7PW7WLxtqoQMz57ew"})
        this.pinataHTTP.changeAuthKey("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmJmNzhjYS04N2Y4LTQzNjctYTcyMi0yZWZiZTQ1ZWM2ODEiLCJlbWFpbCI6InByb2plY3RibG9ja2NoYWluMjAyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYTNiYjc1MGNhNjU0NWRhMmNhYWEiLCJzY29wZWRLZXlTZWNyZXQiOiJkMzQ4YzI1MTg4YjAyYjAwMjI5NTMyMTcwNTM2YTFhYmM3MjEwYzA2ZDM1YjVjNDA4MDcxMjI2YTMxZGI1YTVkIiwiaWF0IjoxNjc0OTI2MDE3fQ.x2b7Ug5Lz79Gc_FBM50FiQ2nxZ7PW7WLxtqoQMz57ew")
        
        const alert = await this.alertController.create({
          header: "Imposta la chiave e la password fornite dallo scrittore",
          inputs: [
            {
              name: "chiave_pubblica",
              placeholder:"CHIAVE"
              
            },
            
            {
              name: "password_inserita",
              placeholder:"PASSWORD"
            }

          ],
          buttons:[
            {
              text: "OK",
              handler: async data => {
                if (data.chiave_pubblica != "" && data.password_inserita != "") {
                  console.log(data.chiave_pubblica)
                  console.log(data.password_inserita)
                  Preferences.set({key:"PublicKey",value: data.chiave_pubblica})
                  Preferences.set({key: "Password", value: data.password_inserita})
                  return 
                } else {
                  const alertERROR = await this.alertController.create({
                    header: "Inserire entrambi i valori richiesti!",
                    buttons:[{
                      text: "Ok"
                    }]
                  })
                  await alertERROR.present()
                  return false
                }

                
                
              }
            }
          ]

        })
        await alert.present();
        await alert.onDidDismiss();

      }
      
      
    } else {
      if(firstRun.value=="false"){
        this.showTabs= true
      }else{
        console.log("dio")
        await Preferences.set({key:"firstRun",value:'true'})
        console.log((await Preferences.get({key:"firstRun"})).value)
        this.firstRun()
      }
      
    } 
    await Preferences.set({key:'firstRun',value:'false'})
    this.showTabs=true     
  }

  crea_password(){

    var elencoCaratteri="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    var minimoCaratteri=6;
    var massimoCaratteri=15;
    var differenzaCaratteri=massimoCaratteri-minimoCaratteri;

    var lunghezza=Math.round((Math.random()*differenzaCaratteri)+minimoCaratteri);

    var incremento=0;
    var password="";

    while(incremento<lunghezza){
       password+=elencoCaratteri.charAt(Math.round(Math.random()*elencoCaratteri.length));
       incremento++;
    }

    return password

  }
}
