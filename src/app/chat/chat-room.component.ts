import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import webstomp from 'webstomp-client';
import { MessageInput, MessageOutput } from '../model/Message';
import { UserOutput } from '../model/User';
import { MessagesService } from '../services/messages.service';
import { SocketioService } from './services/socketio.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  private user: UserOutput | undefined;

  messages: MessageOutput[] = [];

  message = new FormControl('', Validators.required);
  ws = new  WebSocket(environment.WEBSOCKET_ENDPOINT);
  client = webstomp.over(this.ws);
  websocketResponseName = 'my response';
  destination = '/queue/stock-queue';

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
    this.client.connect(environment.WEBSOCKET_USER, environment.WEBSOCKET_PASS, _ => this.receiveBotMessage(), () => {
      setTimeout(() => {
        this.connect();
      }, 1000);
    });
  }

  private keepOnlyFifty(): void {
    this.messages.shift();
  }

  private orderMessages(): void {
    this.messages.sort(
      (a, b) => {
        const da = new Date(a.dateTime);
        const db = new Date(b.dateTime);
        if (da === db) {
          return 0;
        }
        return da > db ? 1 : -1;
      }
    );

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
      this.orderMessages();
    });
  }

  private receiveBotMessage(): any {
    if (this.client.connected) {
      this.client.subscribe(this.destination, message => {
        this.messages.push(JSON.parse(message.body));

        if (this.messages.length > 50) {
          this.keepOnlyFifty();
        }
        this.orderMessages();

        message.ack();
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
