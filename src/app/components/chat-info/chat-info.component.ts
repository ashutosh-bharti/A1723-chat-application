import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.css']
})
export class ChatInfoComponent implements OnInit, OnChanges {
  @Input() infoData: any;
  @Output() closeInfoScreen = new EventEmitter();

  isGroup = false;
  isWait = false;
  listData: any = [];

  constructor(private groupService: GroupService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.infoData.currentValue !== changes.infoData.previousValue && !changes.infoData.firstChange) {
      this.getListData();
    }
  }

  ngOnInit(): void {
    this.getListData();
  }

  getListData(): void {
    this.isProgressBarWait(true);
    if (this.infoData.list[0] === 'g') {
      this.isGroup = true;
      const id = this.infoData.list.substr(1);
      this.groupService.getMembers(id)
        .subscribe(
          (res: any) => {
            this.listData = res;
            this.isProgressBarWait(false);
          },
          (err: any) => {
            this.isProgressBarWait(false);
            console.warn('Something went wrong!');
          }
        );
    }
    else {
      this.isGroup = false;
      const id = this.infoData.list.substr(1);
      this.groupService.getGroupList({
        user_1: this.infoData.userId,
        user_2: id
      })
        .subscribe(
          (res: any) => {
            this.listData = res;
            this.isProgressBarWait(false);
          },
          (err: any) => {
            this.isProgressBarWait(false);
            console.warn('Something went wrong!');
          }
        );
    }
  }

  isProgressBarWait(flag: boolean): void {
    this.isWait = flag;
  }

  closeScreen(): void {
    this.closeInfoScreen.emit();
  }

}
