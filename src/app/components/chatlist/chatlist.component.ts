import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent implements OnInit {
  @Input() userId: number;

  chatList: any = [];

  constructor(private chatService: ChatService) {
    this.userId = 0;
  }

  ngOnInit(): void {
    this.chatService.getChatList(this.userId)
    .subscribe((data: any) => {
      console.log(data);
      this.chatList = data;
    });
  }

}
