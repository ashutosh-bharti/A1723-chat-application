import { Component, OnInit, Input } from '@angular/core';
import { GroupChatService } from 'src/app/services/group-chat.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  @Input() groupId: number;

  memberList: any = [];

  constructor(private groupChatService: GroupChatService) {
    this.groupId = 0;
   }

  ngOnInit(): void {
    this.groupChatService.getMembers(this.groupId)
    .subscribe((res: any) => {
      console.log(res);
      this.memberList = res;
    });
  }

  updateMember(userId: number, isAdmin: boolean): void {
    this.groupChatService.updateMembers({userId, isAdmin, groupId: this.groupId});
  }

}
