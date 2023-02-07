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
    await this.chekcFirstRun()
    this.showTabs = true

  }

  async chekcFirstRun() {

    var firstRun = await Preferences.get({key: "firstRun"})

    if (firstRun.value == "true") {
      //Non fare niente, non dovrebbe mai essere TRUE qui
    } else if (firstRun.value == "false") {
      this.showTabs = true
      //Imposto valori chiave pubblica e privata per autenticazione all'interno del pinataHTTPService
      const publicKey = await Preferences.get({key: "PublicKey"})
      const privateKey = await Preferences.get({key: "PrivateKey"})
      this.pinataHTTP.setPublicKey(publicKey.value)
      this.pinataHTTP.setPrivateKey(privateKey.value)
    } else {

      await Preferences.set({key: "firstRun", value:"true"})
      await this.firstRunChoice()

      
    }

  }

  async firstRunChoice() {
    await Preferences.set({key: "firstRun", value: "false"})
    const publicKey = await Preferences.get({key: "PublicKey"})
    const privateKey = await Preferences.get({key: "PrivateKey"})
    if (publicKey.value == null && privateKey.value == null) {
      //INSERISCO CHIAVE ADMIN DI DEFAULT PER PRIME OPERAZIONI
      await Preferences.set({key:"PublicKey", value:"3f4bac4ade0bd0e5bd03"})
      await Preferences.set({key:"PrivateKey", value:"895f7a0e1eae275dd54984a31feb82d715b50352fdf2640850a9aecbad9d50dc"})
      this.pinataHTTP.setPublicKey("3f4bac4ade0bd0e5bd03")
      this.pinataHTTP.setPrivateKey("895f7a0e1eae275dd54984a31feb82d715b50352fdf2640850a9aecbad9d50dc")
    
    } else {

      this.pinataHTTP.setPublicKey(publicKey.value)
      this.pinataHTTP.setPrivateKey(privateKey.value)
      
    }

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

    var appModeSelected = await Preferences.get({key:"AppMode"})
    if (appModeSelected.value =="writer") {
      await this.firstRunWriter()
      return 
    } else if (appModeSelected.value == "reader") {
      await this.firstRunReader()
      return 
    } else {
      return
      //Niente, non deve entrare qui
    }




    return


  }

  async firstRunWriter() {

    const alert = await this.alertController.create({
      header: "Hai già un altro dispositivo scrittore?",
      subHeader:"",
      message:"",
      buttons:[
        {
          text: 'Si',
          handler: async () => {       
            await this.newWriterDevice()
          },
        },
        {
          text:'No',
          handler: async () => {
            const newKey = await this.pinataHTTP.generateNewAdminKey()
            console.log(newKey)
            Preferences.set({key:"Auth",value: "Bearer "+newKey.JWT})
            Preferences.set({key: "PublicKey", value: newKey.pinata_api_key})
            Preferences.set({key: "PrivateKey", value: newKey.pinata_api_secret})
            let password = this.crea_password()
            Preferences.set({key: "Password", value: password})
            //TODO GENERATORE PASSWORD E SALVARLA IN DB LOCALE
            const alertPass = await this.alertController.create({
                header: "SALVA INFORMAZIONI KEY",
                subHeader: "",
                message: "La tua chiave pubblica da fornire ai lettori è: " + newKey.pinata_api_key + "<br> La tua password è: " + password,
                buttons:[{text:"OK"}]
              })
            await alertPass.present();
            await alertPass.onDidDismiss();
          },
        }
      ]
    })
    await alert.present();
    await alert.onDidDismiss();

    
      return 
  }

  async newWriterDevice() {
    const alert = await this.alertController.create({
      header: "Imposta la chiave pubblica, la chiave privata e la password dell'altro dispositivo",
      inputs: [
        {
          name: "chiave_pubblica",
          placeholder:"Public Key"
          
        },
        {
          name: "chiave_privata",
          placeholder:"Private Key"
          
        },
        {
          name: "password_inserita",
          placeholder:"PASSWORD"
        }

      ],
      buttons:[
        {
          text: "OK",
          handler: async (data: { chiave_pubblica: string; chiave_privata: string; password_inserita: string; }) => {
            if (data.chiave_pubblica != "" && data.chiave_privata != "" && data.password_inserita != "") {
              console.log(data.chiave_pubblica)
              console.log(data.chiave_privata)
              console.log(data.password_inserita)
              Preferences.set({key:"PublicKey",value: data.chiave_pubblica})
              Preferences.set({key:"PrivateKey",value: data.chiave_privata})
              Preferences.set({key: "Password", value: data.password_inserita})
              return 
            } else {
              const alertERROR = await this.alertController.create({
                header: "Inserire tutti i valori richiesti!",
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


  async firstRunReader() {
        //Inserisco valori per reader di default 
        await Preferences.set({key:"PublicKey",value:"20ce92887e63a9cfdcee"})
        await Preferences.set({key:"PrivateKey",value:"f917761c57a8ced1f3e4c373c08123225249e293f21d1a28d8f4685c74def1f1"})
        await this.pinataHTTP.setPublicKey("20ce92887e63a9cfdcee")
        await this.pinataHTTP.setPrivateKey("f917761c57a8ced1f3e4c373c08123225249e293f21d1a28d8f4685c74def1f1")

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
              handler: async (data: { chiave_pubblica: string; password_inserita: string; }) => {
                if (data.chiave_pubblica != "" && data.password_inserita != "") {
                  console.log(data.chiave_pubblica)
                  console.log(data.password_inserita)
                  Preferences.set({key:"WriterPublicKey",value: data.chiave_pubblica})
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