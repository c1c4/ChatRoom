import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

  constructor(
    private socketService: SocketioService,
    private messageService: MessagesService
  ) { }

  ngOnInit(): void {
    this.loadLastFifty();
    this.socketService.setupSocketConnection();
    this.retrieveUserFromLocalStorage();
    this.receiveMessage();
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
    this.socketService.socket.on('my response', (msgOutput: MessageOutput) => {
      this.messages.push(msgOutput);
      if (this.messages.length > 50) {
        this.messages.shift();
      }
    });

    this.socketService.socketBot.on('botResponse', (msgOutput: MessageOutput) => {
      console.log(msgOutput);
      this.messages.push(msgOutput);
      if (this.messages.length > 50) {
        this.messages.shift();
      }
    });
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
