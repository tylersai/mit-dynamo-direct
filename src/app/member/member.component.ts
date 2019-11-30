import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from "@ionic/angular";
import * as AWS from 'aws-sdk';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class MemberComponent implements OnInit {

  MEMBER_TABLE_NAME = "member";

  isEdit : boolean = false;
  isNew : boolean = false;

  member = this.getNewObj();
  
  docClient : AWS.DynamoDB.DocumentClient;

  constructor(private route:ActivatedRoute,private router:Router,public alertCtrl : AlertController) {
    AWS.config.update({
      region: 'us-east-2',
      accessKeyId: "AKIAI7KKLA7CB4Y5BQYA",
      secretAccessKey: "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"
    });
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  ngOnInit() {
    this.member.id = this.route.snapshot.paramMap.get('id');
    console.log(this.member.id);

    if(this.member.id){
      let params :  AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName : this.MEMBER_TABLE_NAME,
        Key: {
          "id":parseInt(this.member.id)
        }
      };
      let _self = this;
      this.docClient.get(params,(err,data)=>{
        if(!err){
          console.log(data.Item);
          if(data.Item){
          _self.member.name=data.Item.name;
          _self.member.points = data.Item.points != undefined ? data.Item.points:0;
          }
        }else{
          this.showAlert("Fail","Ooops! Unable to fetch member!");
        }
      });
    }else{
      this.isEdit = true;
      this.isNew = true;
    }

  }

  getNewObj(){
    return {
      id:'',
      name:'',
      points:''
    };
  }

  async showAlert(header:string ='',message:string = '', buttons:string[] = ['OK']) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: buttons
    });

    await alert.present();
  }

  onSaveOrEdit(event){
    if(event.target.innerHTML == "Edit"){
      this.isEdit = true;
    }else{
      if(this.member.id){
        //save here
      let params :  AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName : this.MEMBER_TABLE_NAME,
        Item: {
          "id":parseInt(this.member.id),
          "name": this.member.name + '',
          "points": (!isNaN(parseInt(this.member.points)) ? parseInt(this.member.points) : 0)
        }
      };
      this.docClient.put(params,(err,data)=>{
        if(err)
          this.showAlert("Save Fail","Ooops! Error saving member!");
        else{
          this.isEdit = false;
          this.isNew = false;
          this.showAlert("Saved","Member is saved successfully!");
        }
      });
      }else{
        this.showAlert("Save Warning","Please fill in the member info!");
      }
    }
  }

  goNew(){
    this.isEdit = true;
    this.isNew = true;
    this.member = this.getNewObj();
  }

  goDelete(){
    if(this.member.id){
      let params :  AWS.DynamoDB.DocumentClient.DeleteItemInput = {
        TableName : this.MEMBER_TABLE_NAME,
        Key: {
          "id":parseInt(this.member.id)
        }
      };
      this.docClient.delete(params,(err,data)=>{
        if(err)
        this.showAlert("Delete Error","Unable to delete member. Try Again.");
        else{
          this.showAlert("Deleted","Member successfully deleted");
          this.router.navigate(['/memberlist']);
        }
      });
    }else{
      this.showAlert("Delete Warning","No Member to delete!");
    }
  }

}
