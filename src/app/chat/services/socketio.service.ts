import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { MessageInput } from 'src/app/model/Message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket!: Socket;
  socketBot!: Socket;

  constructor() { }

  setupSocketConnection(): void {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socketBot = io('http://localhost:5000/');
  }

  sendMessage(message: MessageInput): void {
    this.socket.emit('message', message);
  }
}
