import { Component, OnInit} from '@angular/core';
import { AuthenticService } from 'src/app/services/authentic.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit{

  user: any;

  constructor(private auth: AuthenticService) {}

  ngOnInit(): void {
    this.user = this.auth.user;
  }

}

