import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatOperationService } from '../../services/chat-operation.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  private user: any;

  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;

  members: any = [];
  chats: any = [];
  rooms: string[] = ['Angular', 'Javascript', 'Java', 'Node', 'Python'];
  joinned = true;
  channelList: any = [];
  newUser = { username: '', room: '' };
  msgData = { room: '', username: '', message: ''};

  constructor(private chatService: ChatOperationService) {}

  ngOnInit(): void {
    // this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = this.newUser;
    if (this.user !== null && this.user.username !== '') {
      this.getChatByRoom(this.user.room);
      this.msgData = { room: this.user.room, username: this.user.username, message: '' };
      this.joinned = true;
      this.getUsersOfRoom();
      this.scrollToBottom();
    }

    this.chatService
    .getMessage()
    .subscribe((data: any) => {
      if (data.room === this.user.room) {
        this.chats.push(data);
        this.msgData = { room: this.user.room, username: this.user.username, message: '' };
        this.scrollToBottom();
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  getUsersOfRoom(): void {
    this.chatService
      .getUsersOfRoom()
      .subscribe((data: any) => this.members = data);
  }

  getChatByRoom(room: string): void {
    // this.chatService.getChatByRoom(room)
    //   .subscribe((res: any) => {
    //     if (res.room === this.user.room) {
    //       this.chats = res.result;
    //     }
    //   });
  }

  joinRoom(): void {
    const date = new Date();
    // localStorage.setItem('user', JSON.stringify(this.newUser));
    this.user = this.newUser;
    this.getChatByRoom(this.user.room);
    this.msgData = { room: this.user.room, username: this.user.username, message: '' };
    this.chatService.joinRoom({
      username: this.user.username,
      room: this.user.room,
      updated_at: date
    });
    this.joinned = true;
    this.getUsersOfRoom();
  }

  sendMessage(): void {
    const date = new Date();
    this.chatService.sendMessage({
      username: this.msgData.username,
      room: this.msgData.room,
      message: this.msgData.message,
      updated_at: date
    });
    // this.msgData = { room: this.user.room, username: this.user.username, message: '' };
    // this.chatService.saveChat(this.msgData)
    // .then((result: any) => {
    //   this.socket.emit('save-message', result);
    // }, (err: any) => {
    //   console.log(err);
    // });
  }

  logout(): void {
    const date = new Date();
    this.chatService.leaveRoom({
      room: this.user.room,
      username: this.user.username,
      updated_at: date
    });
    this.user = null;
    this.joinned = false;
    this.members = null;
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
  }

}
