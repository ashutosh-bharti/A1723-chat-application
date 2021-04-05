import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable()
export class ChatOperationService {

  constructor(private socket: Socket) { }

  // Join chat room
  joinRoom(data: any): void {
    this.socket.emit('joinRoom', data);
  }

  // Register chat rooms
  registerRooms(data: any): void {
    this.socket.emit('registerRooms', data);
  }

  // Emit event to get active user
  getActiveUsers(data: any): void {
    this.socket.emit('activeUsers', data);
  }

  // Get room and users
  getUsersOfRoom(): any {
    return this.socket
      .fromEvent('roomUsers')
      .pipe(map((data: any) => data.users));
  }

  // Emit message to server
  sendMessage(message: any): void {
    this.socket.emit('chatMessage', message);
  }

  // PrivateMessage from server
  getPrivateMessage(): any {
    return this.socket
      .fromEvent('privateMessage')
      .pipe(map((data: any) => data.result));
  }

  // Message from server
  getMessage(): any {
    return this.socket
      .fromEvent('message')
      .pipe(map((data: any) => data.result));
  }

  // BotMessage from server
  getBotMessage(): any {
      return this.socket
        .fromEvent('botMessage')
        .pipe(map((data: any) => data.result));
  }

  // Leave chat room
  leaveRoom(data: any): void {
    this.socket.emit('leaveRoom', data);
  }

  // User logout
  userLogout(): void {
    this.socket.emit('logout');
  }

}
