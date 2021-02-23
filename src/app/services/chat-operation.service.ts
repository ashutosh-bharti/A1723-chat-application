import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable()
export class ChatOperationService {

  constructor(private socket: Socket) { }

  // Join chat room
  joinRoom(data: any): void {
    this.socket.emit('joinRoom', { username: data.username, room: data.room, updated_at: data.updated_at});
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

  // Message from server
  getMessage(): any {
    return this.socket
      .fromEvent('message')
      .pipe(map((data: any) => data.result));
  }

  // Leave chat room
  leaveRoom(data: any): void {
    this.socket.emit('leaveRoom', { username: data.username, room: data.room, updated_at: data.updated_at });
  }

}
