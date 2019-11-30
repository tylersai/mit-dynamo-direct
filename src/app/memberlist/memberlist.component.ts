import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.scss'],
})
export class MemberlistComponent implements OnInit {

  MEMBER_TABLE_NAME = "member";

  noListMsg : string = '';
  dynamodb : AWS.DynamoDB;
  memberlist : any;

  constructor() {
    AWS.config.update({
      region: 'us-east-2',
      accessKeyId: "AKIAI7KKLA7CB4Y5BQYA",
      secretAccessKey: "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"
    });
    this.dynamodb = new AWS.DynamoDB();
  }

  ngOnInit() {
    this.goRefresh();
  }

  compareFun(a,b){
    if(a.id>b.id) return 1;
    if(a.id<b.id) return -1;
    return 0;
  }

  goRefresh(){
    this.noListMsg = '';
    let params : AWS.DynamoDB.QueryInput = {
      TableName : this.MEMBER_TABLE_NAME
    };
    this.dynamodb.scan(params,(err,data)=>{
      if(err){
        this.noListMsg = 'No Member';
        console.log(err);
      }else{
        console.log(data.Items);
        this.memberlist = data.Items;
      }
    });
  }

}
