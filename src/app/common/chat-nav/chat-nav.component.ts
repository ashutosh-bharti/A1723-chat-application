import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { GroupService } from 'src/app/services/group.service';
import { ChatService } from 'src/app/services/chat.service';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-chat-nav',
  templateUrl: './chat-nav.component.html',
  styleUrls: ['./chat-nav.component.css']
})
export class ChatNavComponent implements OnInit {

  @Input() userId = 0;
  @Output() logoutEvent = new EventEmitter();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isInfoScreenVisible = false;
  isWait = false;
  isNewItemInserted = false;
  isChatScreenVisible = false;
  chatListItem: any;
  infoScreenData: any;
  tiles: any;
  newChatItem: any;

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private groupService: GroupService,
              private chatService: ChatService
  ) {
       this.isWait = false;
  }

  ngOnInit(): void {
    this.tiles = {
      length: 3,
        data: [
          { cols: 1, color: 'gray' },
          { cols: 2, color: 'lightblue' },
          { cols: 1, color: 'gray' },
        ]
    };
  }

  onProfileViewClick(): void {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      width: '450px'
    });
  }

  onMenuClick(flag: number): void {
    const dialogData = { title: '', description: '', data: ''};
    switch (flag) {
      case 1: dialogData.title = 'Create Personal Chat';
              dialogData.description = 'Please enter username of that person:';
              break;
      case 2: dialogData.title = 'Create Group';
              dialogData.description = 'Please enter group name:';
              break;
      case 3: dialogData.title = 'Join Group';
              dialogData.description = 'Please enter group code:';
              break;
    }
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      width: '250px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const data = result.trim();
        switch (flag) {
          case 1: // create Personal Chat
              this.isWait = true;
              this.chatService.createChatList({
                email: data, userId: this.userId
              })
              .subscribe(
                (res: any) => {
                  if (res.found) {
                    this.isWait = false;
                    alert(res.message);
                  }
                  else {
                    this.isWait = false;
                    this.isNewItemInserted = true;
                    this.getChatScreen(res.data);
                  }
                },
                (error: any) => {
                  this.isWait = false;
                  alert('User Not Found!');
                  console.warn('Something went wrong!');
                }
              );
              break;
          case 2: // create group
              this.isWait = true;
              this.groupService.createGroup({
                name: data, userId: this.userId
              })
              .subscribe((res: any) => {
                this.isWait = false;
                this.isNewItemInserted = true;
                this.getChatScreen(res);
              });
              break;
          case 3: // join group
              this.isWait = true;
              this.groupService.addMember({
                groupCode: data, userId: this.userId
              })
              .subscribe(
                (res: any) => {
                  if (res.found) {
                    this.isWait = false;
                    alert(res.message);
                  }
                  else {
                    this.isWait = false;
                    this.isNewItemInserted = true;
                    this.getChatScreen(res.data);
                  }
                },
                (error: any) => {
                  this.isWait = false;
                  alert('Group Not Found!');
                  console.warn('Something went wrong!');
                }
              );
              break;
        }
      }
    });
  }

  onLogout(): void {
    this.logoutEvent.emit();
  }

  isWaitEventAction(flag: boolean): void {
    this.isWait = flag;
  }

  getChatScreen(item: any): void {
    if (this.isNewItemInserted === false) {
      this.newChatItem = null;
    }
    else {
      this.newChatItem = item;
      this.isNewItemInserted = false;
    }
    this.chatListItem = item;
    this.closeInfoScreen();
  }

  closeChatScreen(): void {
    this.isChatScreenVisible = false;
    this.chatListItem = undefined;
    this.closeInfoScreen();
  }

  getInfoScreen(response: any): void {
    this.infoScreenData = response;
    this.isInfoScreenVisible = true;
    this.tiles.length = 4;
  }

  closeInfoScreen(): void {
    this.tiles.length = 3;
    this.isInfoScreenVisible = false;
    this.infoScreenData = undefined;
  }
}
