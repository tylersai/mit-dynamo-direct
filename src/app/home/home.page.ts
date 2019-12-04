import { Component } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Router } from '@angular/router';
import { AlertController, Platform, NavController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ADMIN_TABLE_NAME = "admin";

  title = 'AWS DynamoDB Direct';
  admin = { username: '', password: '' };
  docClient : AWS.DynamoDB.DocumentClient;
  showLoader: boolean = false;
  showError: boolean = false;

  ngOnInit(): void {
    AWS.config.update({
      region: 'us-east-2',
      accessKeyId: "access_key_id",
      secretAccessKey: "secret_access_key"
    });
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  constructor(private router:Router, public alertCtrl:AlertController, public platform:Platform, public nav:NavController){
    this.platform.backButton.subscribe(()=>{
      this.nav.back();
    });
  }

  async showAlert(header:string ='',message:string = '', buttons:string[] = ['OK']) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: buttons
    });

    await alert.present();
  }

  goLogin(){
    if(this.admin.username && this.admin.password){
      this.showLoader = true;
      this.showError = false;

      let params :  AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName : this.ADMIN_TABLE_NAME,
        Key: {
          "username":this.admin.username
        }
      };
      let _self = this;
      this.docClient.get(params,(err,data)=>{
        _self.showLoader = false;
        if(err) _self.showError = true;
        else{
          if(data && data.Item && data.Item.username === _self.admin.username && data.Item.password === _self.admin.password){
            console.log("Login Success : ",JSON.stringify(data.Item,null,4));
            this.router.navigate(['/memberlist']);
          }else _self.showError = true;
        }
      });
    }else{
      if(!this.admin.username && !this.admin.password)
        this.showAlert("Warning","Please enter username and password!");
      else if(!this.admin.username)
        this.showAlert("Warning","Please enter username");
      else
        this.showAlert("Warning","Please enter password!");
    }
  }

}
