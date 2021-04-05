import { Component, OnInit } from '@angular/core';
import { AuthenticService } from 'src/app/services/authentic.service';
import { ChatOperationService } from 'src/app/services/chat-operation.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLogin = false;
  userId = 0;
  toggle = true;

  constructor(private auth: AuthenticService, private chatOp: ChatOperationService) { }

  ngOnInit(): void {
    if (this.auth.user) {
      this.userId = this.auth.user.id;
      this.isLogin = true;
    }
  }

  login(userId: number): void {
    this.isLogin = true;
    this.userId = userId;
  }

  logout(): void {
    this.auth.user = null;
    this.isLogin = false;
    this.userId = 0;
    this.chatOp.userLogout();
  }

  onToggleCard(): void {
    this.toggle = !this.toggle;
  }
}
