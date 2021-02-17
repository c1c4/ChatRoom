import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import webstomp, { Client } from 'webstomp-client';
import { MessageInput, MessageOutput } from '../model/Message';
import { UserOutput } from '../model/User';
import { MessagesService } from '../services/messages.service';
import { SocketioService } from './services/socketio.service';
import * as moment from 'moment';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  private user: UserOutput | undefined;

  messages: MessageOutput[] = [];

  message = new FormControl('', Validators.required);
  websocketResponseName = 'my response';
  destination = '/queue/stock-queue';

  client!: Client;

  constructor(
    private socketService: SocketioService,
    private messageService: MessagesService
  ) { }

  ngOnInit(): void {
    this.connect();
    this.loadLastFifty();
    this.socketService.setupSocketConnection();
    this.retrieveUserFromLocalStorage();
    this.receiveMessage();
  }

  private connect(): void {
    const ws = new  WebSocket(environment.WEBSOCKET_ENDPOINT, ['v10.stomp', 'v11.stomp', 'v12.stomp']);
    this.client = webstomp.over(ws);
    this.client.connect(environment.WEBSOCKET_USER, environment.WEBSOCKET_PASS, _ => this.receiveBotMessage(), () => {
      setTimeout(() => {
        this.connect();
      }, 1000);
    });
  }

  private keepOnlyFifty(): void {
    this.messages.shift();
  }

  private orderMessages(listMessages: MessageOutput[]): MessageOutput[] {
    listMessages.sort(
      (a, b) => {
        const da = moment(a.dateTime, 'DD/MM/YYYY HH:mm:ss').toDate().getTime();
        const db = moment(b.dateTime, 'DD/MM/YYYY HH:mm:ss').toDate().getTime();
        if (da === db) {
          return 0;
        }
        return da > db ? 1 : -1;
      }
    );

    return listMessages;

  }

  private retrieveUserFromLocalStorage(): void {
    const userString = localStorage.getItem('user');

    if (userString !== null) {
      this.user = JSON.parse(userString);
    }

  }

  private loadLastFifty(): void {
    this.messageService.getLastFifty().subscribe(
      messagesList => this.messages = messagesList,
      error => console.log(error)
    );
  }

  private receiveMessage(): any {
    this.socketService.socket.on(this.websocketResponseName, (msgOutput: MessageOutput) => {
      this.messages.push(msgOutput);
      if (this.messages.length > 50) {
        this.keepOnlyFifty();
      }
      const temp = this.orderMessages(this.messages);
      this.messages = temp;
    });
  }

  private receiveBotMessage(): any {
    if (this.client.connected) {
      this.client.subscribe(this.destination, message => {
        this.messages.push(JSON.parse(message.body));

        if (this.messages.length > 50) {
          this.keepOnlyFifty();
        }
        const temp = this.orderMessages(this.messages);
        this.messages = temp;
        message.nack();
      });
    }
  }

  sendMessage(): void {
    if (!this.message.invalid) {
      const msg: MessageInput = {
        message: this.message.value,
        userId: this.user?.id || 0
      };

      this.socketService.sendMessage(msg);
      this.message.setValue(null);
    }
  }


}
