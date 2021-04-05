import {
  Component, OnInit, ElementRef,
  ViewChild, Input, Output, EventEmitter, OnChanges,
  SimpleChanges, ViewChildren, QueryList, AfterViewChecked
} from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ChatOperationService } from 'src/app/services/chat-operation.service';
import { AuthenticService } from 'src/app/services/authentic.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges, AfterViewChecked {

  @Input() chatItem: any;
  @Output() getInfoScreenEvent = new EventEmitter<any>();
  @Output() isWaitEvent = new EventEmitter<boolean>();
  @ViewChild('scrollframe', { static: false })
  scrollFrame!: ElementRef;
  @ViewChildren('item')
  itemElements!: QueryList<any>;

  private users: any;
  private scrollContainer: any;
  private isNearBottom = true;
  isAuthorSame = false;
  isGroup = false;
  isScroll = false;
  isWait = false;
  onlineStatusText = '';

  Chats: any = [];
  msgData = { room: '', userId: '', message: ''};
  userdata = {};

  constructor(private chatOp: ChatOperationService, private chatSer: ChatService, private auth: AuthenticService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chatItem.currentValue !== changes.chatItem.previousValue && !changes.chatItem.firstChange) {
      this.msgData = { room: this.chatItem.list, userId: this.chatItem.userId, message: '' };
      this.getChats();
      this.changeRoom();
    }
  }

  ngOnInit(): void {
    this.userdata = {
      id: this.auth.user.id,
      firstName: this.auth.user.firstName,
      lastName: this.auth.user.lastName
    };
    this.msgData = {
      room: this.chatItem.list,
      userId: this.chatItem.userId,
      message: ''
    };

    this.getChats();
    this.changeRoom();
    this.getMessage();
    this.getUsersOfRoom();
  }

  ngAfterViewChecked(): void {
    this.scrollContainer = this.scrollFrame?.nativeElement;
    if (this.isScroll) {
      this.onItemElementsChanged();
      this.isScroll = false;
    }
  }

  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 200;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  getUsersOfRoom(): void {
    this.chatOp
      .getUsersOfRoom()
      .subscribe((data: any) => {
        this.users = data;
        if (this.isGroup) {
          this.onlineStatusText = `${data.length} online`;
        }
        else if (data.length === 1) {
          this.onlineStatusText = 'online';
        }
        else {
          this.onlineStatusText = 'offline';
        }
      });
  }

  changeRoom(): void {
    if (this.chatItem.list[0] === 'u') {
      this.isGroup = false;
    }
    else {
      this.isGroup = true;
    }
    this.chatOp
      .getActiveUsers({room: this.chatItem.list});
  }

  sendMessage(): void {
    this.onWait(true);
    this.chatSer.createMessage({
      text: this.msgData.message,
      userId: this.msgData.userId,
      messageFor: this.msgData.room
    })
    .subscribe((msg: any) => {
      this.chatSer.createChat({
        userId: this.msgData.userId,
        messageId: msg.id,
        list: this.msgData.room
      })
      .subscribe((chat: any) => {
        msg.User = this.userdata;
        chat.Message = msg;
        chat.state = null;
        this.Chats.push(chat);
        this.chatOp.sendMessage(chat);
        this.isScroll = true;
      });
    });
    this.msgData.message = '';
  }

  getMessage(): void {
    this.chatOp
      .getMessage()
      .subscribe((data: any) => {
        if (data.list === this.msgData.room) {
          this.chatSer.updateChatStatus(data.messageId, {
            userId: this.msgData.userId,
            list: this.msgData.room
          })
          .subscribe((res: any) => { });

          if (data.userId !== this.msgData.userId) {
            data.state = true;
            this.Chats.push(data);
            this.isScroll = true;
          }
          else {
            const len = this.Chats.length;
            this.Chats[len - 1].state = true;
          }
          this.onWait(false);
        }
      });

    this.chatOp
      .getBotMessage()
      .subscribe((data: any) => {
        if (data.list === this.msgData.room) {
          data.state = true;
          this.Chats.push(data);
          this.onWait(false);
          this.isScroll = true;
        }
      });

    this.chatOp
      .getPrivateMessage()
      .subscribe((data: any) => {
        if (data.list === this.msgData.room) {
          data.state = true;
          this.Chats.push(data);
          this.onWait(false);
          this.isScroll = true;
        }
      });
  }

  getChats(): void {
    this.isProgressBarWait(true);
    this.chatSer.getChats(this.chatItem.id)
      .subscribe(
        (data: any) => {
          const len = data.length;
          data[len - 1].state = true;
          this.Chats = data;

          this.chatSer.updateChatStatus(data[len - 1].messageId, {
            userId: this.msgData.userId,
            list: this.msgData.room
          })
          .subscribe((res: any) => { });

          this.isProgressBarWait(false);
          this.isScroll = true;
        },
        (error: any) => {
          this.isProgressBarWait(false);
          console.warn('Something went wrong!');
        }
      );
  }

  info(flag: string, data: any = this.chatItem): void {
    if (flag === 'header'){
      this.getInfoScreenEvent.emit({flag: true, data});
    }
    else {
      data.activeUsers = this.users;
      this.getInfoScreenEvent.emit({flag: false, data});
    }
  }

  onWait(flag: boolean): void {
    this.isWaitEvent.emit(flag);
  }

  isProgressBarWait(flag: boolean): void {
    this.isWait = flag;
  }

  isprevMsgFromOtherDay(index: number): boolean {
    if (index === 0) {
      return true;
    }
    const prevIndex = index - 1;
    const prevDate = new Date(this.Chats[prevIndex].Message.createdAt);
    const date = new Date(this.Chats[index].Message.createdAt);
    return prevDate.setHours(0, 0, 0, 0) < date.setHours(0, 0, 0, 0);
  }

  isPrevSameAuthor(index: number): boolean {
    this.isAuthorSame = false;
    if (this.chatItem.list[0] === 'u') {
      this.isAuthorSame = true;
      return true;
    }
    if (index === 0) {
      return false;
    }
    const isSamedate = !this.isprevMsgFromOtherDay(index);
    const prevIndex = index - 1;
    const prevUser = this.Chats[prevIndex].Message.owner;
    const currUser = this.Chats[index].Message.owner;
    this.isAuthorSame = (prevUser === currUser) && isSamedate;
    return this.isAuthorSame;
  }

}
