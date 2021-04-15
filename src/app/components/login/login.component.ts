import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { AuthenticService } from 'src/app/services/authentic.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() loginEvent = new EventEmitter<number>();

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private auth: AuthenticService) { }

  ngOnInit(): void {  }

  onSubmit(): void {
    this.auth.login(this.loginForm.value)
      .subscribe(
        (res: any) => {
          this.auth.getUser(res.id)
            .subscribe(
              (userInfo: any) => {
              this.auth.user = userInfo;
              this.loginEvent.emit(res.id);
              },
              (error: any) => {
                alert('User Not Found!');
                console.warn('Something went wrong!');
              }
            );
        },
        (error: any) => {
          alert('User Not Found!');
          console.warn('Something went wrong!');
        }
      );
  }

}
