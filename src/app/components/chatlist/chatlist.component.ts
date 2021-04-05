import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AuthenticService } from 'src/app/services/authentic.service';
import { ChatOperationService } from 'src/app/services/chat-operation.service';
import { ChatService } from 'src/app/services/chat.service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent implements OnInit, OnChanges {
  @Input() userId = 0;
  @Input() newChatItem: any;
  @Output() getChatScreenEvent = new EventEmitter<any>();
  @Output() closeChatScreenEvent = new EventEmitter();

  isWait = false;
  chatList: any = [];

  constructor(private chatOp: ChatOperationService,
              private chatSer: ChatService,
              private groupService: GroupService,
              private auth: AuthenticService) {  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.newChatItem !== null
      && changes.newChatItem.currentValue !== null
      && changes.newChatItem.currentValue !== changes.newChatItem.previousValue) {
      this.onNewChatItem();
    }
  }

  ngOnInit(): void {
    this.getData();
    this.getPrivateChat();
    this.registerRooms([]);
  }

  getData(): void {
    if (this.userId > 1) {
      this.isProgressBarWait(true);
      this.chatSer.getChatList(this.userId)
        .subscribe(
          (data: any) => {
            this.chatList = data;
            this.sortChatlist();
            this.registerRooms(data);
            this.isProgressBarWait(false);
          },
          (error: any) => {
            this.isProgressBarWait(false);
            console.warn('Something went wrong!');
          }
        );
    }
  }

  getPrivateChat(): void {
    this.chatOp.getPrivateMessage().subscribe((data: any) => {
      const index = this.chatList.findIndex((item: any) => item.list === data.list);
      if (index !== -1) {
        this.chatList[index].Chat = data;
        this.sortChatlist();
      }
      else {
        setTimeout(() => {
          this.getData();
        }, 3000);
      }
    });
    this.chatOp.getMessage().subscribe((data: any) => {
      const index = this.chatList.findIndex((item: any) => item.list === data.list);
      if (index !== -1) {
        this.chatList[index].Chat = data;
        this.sortChatlist();
      }
    });
    this.chatOp.getBotMessage().subscribe((data: any) => {
      const index = this.chatList.findIndex((item: any) => item.list === data.list);
      if (index !== -1) {
        setTimeout(() => {
          this.getData();
        }, 3000);
      }
    });
  }

  registerRooms(data: any): void {
    const rooms = data.filter((item: any) => item.list[0] === 'g')
                      .map((item: any) => item.list);
    rooms.push(`u${this.userId}`);
    this.chatOp.registerRooms({ rooms, userId: this.userId });
  }

  sortChatlist(): void {
    this.chatList.sort((a: any, b: any) => {
      const d1: Date = new Date(a.Chat.updatedAt);
      const d2: Date = new Date(b.Chat.updatedAt);
      return d2.getTime() - d1.getTime();
    });
  }

  deleteChatList(item: any): void {
    if (item.list[0] === 'u') {
      this.chatSer.deleteChatList(item.id)
        .subscribe((res: any) => {
          alert('ChatList Deleted');
        });
    }
    else {
      const id = item.list.substr(1);
      this.groupService.leaveGroup(id, item.userId)
        .subscribe((res: any) => {
          this.chatSer.deleteChatList(item.id)
            .subscribe((res1: any) => {
              alert('ChatList Deleted');
            });
        });
      const msg = `${this.auth.user.firstName} left the group`;
      this.chatSer.createMessage({
        text: msg,
        userId: 1,
        messageFor: item.list
      })
        .subscribe((res: any) => {
          const data = {
            userId: this.userId,
            room: item.list,
            msgData: res
          };
          this.chatOp.leaveRoom(data);
        });
    }
    const index = this.chatList.findIndex((itm: any) => itm.id === item.id);
    if (index !== -1) {
      this.chatList.splice(index, 1);
      this.closeChatScreen();
    }
  }

  onNewChatItem(): void {
    this.chatList.push(this.newChatItem);
    this.sortChatlist();
    if (this.newChatItem.list[0] === 'g') {
      const msg = `${this.auth.user.firstName} joined the group`;
      this.chatSer.createMessage({
        text: msg,
        userId: 1,
        messageFor: this.newChatItem.list
      })
        .subscribe((res: any) => {
          const data = {
            userId: this.userId,
            room: this.newChatItem.list,
            msgData: res
          };
          this.chatOp.joinRoom(data);
        });
    }
  }

  isMsgFromOtherDay(item: any): boolean {
    const itemDate = new Date(item.updatedAt.substr(0, 10));
    const now = new Date();
    const today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return itemDate.setHours(0, 0, 0, 0) !== today.setHours(0, 0, 0, 0);
  }

  actionDailog(item: any): void {
    console.log('action clicked', item);
    this.deleteChatList(item);
  }

  viewChatScreen(item: any): void {
    this.getChatScreenEvent.emit(item);
  }

  closeChatScreen(): void {
    this.closeChatScreenEvent.emit();
  }

  isProgressBarWait(flag: boolean): void {
    this.isWait = flag;
  }

}
