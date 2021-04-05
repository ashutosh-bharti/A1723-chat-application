import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-message-info',
  templateUrl: './message-info.component.html',
  styleUrls: ['./message-info.component.css']
})
export class MessageInfoComponent implements OnInit, OnChanges {
  @Input() infoData: any;
  @Output() closeInfoScreen = new EventEmitter();

  dataList: any;
  deliveredList: any = [];
  seenList: any = [];
  sentList: any = [];
  isGroup = false;
  isWait = false;

  constructor(private chatService: ChatService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.infoData.currentValue !== changes.infoData.previousValue && !changes.infoData.firstChange) {
      this.getMessageDetails();
    }
  }

  ngOnInit(): void {
    console.log(this.infoData);
    this.getMessageDetails();
  }

  getMessageDetails(): void {
    this.isProgressBarWait(true);
    if (this.infoData.messageFor[0] === 'g') {
      this.isGroup = true;
    }
    this.chatService.getMessageDetails(this.infoData.id)
      .subscribe(
        (res: any) => {
          this.dataList = res;
          this.filterList();
          this.isProgressBarWait(false);
        },
        (err: any) => {
          this.isProgressBarWait(false);
          console.warn('Something went wrong!');
        }
      );
  }

  filterList(): void {
    this.deliveredList = this.dataList.filter((res: any) => res.state === 0 && res.userId !== this.infoData.owner);
    this.seenList = this.dataList.filter((res: any) => res.state === 1 && res.userId !== this.infoData.owner);
    this.sentList = this.dataList.filter((res: any) => res.state === null && res.userId !== this.infoData.owner);
  }

  closeScreen(): void {
    this.closeInfoScreen.emit();
  }

  isProgressBarWait(flag: boolean): void {
    this.isWait = flag;
  }

}
