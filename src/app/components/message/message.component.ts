import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { MsgDataService } from 'src/app/services/msg-data.service';
import { ClipboardService } from 'ngx-clipboard';
import * as vkbeautify from 'vkbeautify';



@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {

  record: any = [];
  obj1 = {
    id: '',
    originalMsg: '',
    status: '',
    identifier: ''
  }
  obj2 = {
    id: '',
    translatedMsg: '',
    status: '',
    identifier: ''
  }
  // originalMsg: string = "";
  // translatedMsg: string = "";
  originalMsgIndex: number[]=[];
  // originalMsgArray: string[]=[];
  selectedId: any;
  message: any;


  copiedStates:boolean = false;
  formattedOriginalMsg: string = "Loading...";
  formattedTranslatedMsg:string = "Loading...";



  constructor (
    private msgDataService: MsgDataService,
    private clipboardService: ClipboardService

  ) {}

  ngOnInit() {
    // this.selectedId = this.msgDataService.getSelectedId();
    this.loadMessages();
  }

  copyToClipboard(text: string, button: HTMLButtonElement) {
    // Your copy to clipboard logic here
    this.copiedStates = true;
    this.clipboardService.copyFromContent(text);
    button.innerText = '✔️Copied!';
    setTimeout(() => {
      button.innerText = '📑Copy';
      this.copiedStates = false;

    }, 2000);
  }

  loadMessages() {
    this.msgDataService.getSelectedIdMessages().subscribe(
      response => {
        // this.message = response.message;
        this.obj1.originalMsg = response[0].message;
        this.obj1.id = response[0].id;
        this.obj1.status = response[0].status;
        this.obj1.identifier = response[0].identifier;

        if(this.obj1.originalMsg[0] == '<'){
          this.formattedOriginalMsg = this.formatXml(this.obj1.originalMsg);
        }
        else{
          this.formattedOriginalMsg = this.formatJson(this.obj1.originalMsg);
        }

        if(response.length === 1){

          this.formattedTranslatedMsg = "MESSAGE NOT TRANSLATED";

        } else {

        this.obj2.translatedMsg = response[1].message;
        this.obj2.id = response[1].id;
        this.obj2.identifier = response[1].identifier;
        this.obj2.status = response[1].status;

        if(this.obj2.translatedMsg[0] == '<'){
          this.formattedTranslatedMsg = this.formatXml(this.obj2.translatedMsg);
        }
        else{
          this.formattedTranslatedMsg = this.formatJson(this.obj2.translatedMsg);
        }

        console.log(response);
        console.log(this.obj1);

      }

      },
      error => {
        this.formattedOriginalMsg = "DATA NOT PROCESSED";
        this.formattedTranslatedMsg = "DATA NOT PROCESSED";
        console.log('error');
      }
    )
  }

  shouldHighlight(index: number): boolean {
    return this.originalMsgIndex.includes(index);
  }

  goBack(): void {
    window.history.back();
  }

  formatXml(xml: string): string {
    var formattedXml = '';
    try {
      formattedXml = vkbeautify.xml(xml);
      // console.log('try');
    } catch (error) {
      // console.log('catch');
      console.error('Error formatting XML:', error);
      formattedXml = xml; // Display the original XML if formatting fails
    }
    return formattedXml;
  }
  formatJson(json: string): string {
    let formattedJson = '';
    try {
      formattedJson = vkbeautify.json(json);
    } catch (error) {
      console.error('Error formatting JSON:', error);
      formattedJson = json; // Display the original JSON if formatting fails
    }
    return formattedJson;
  }
}
