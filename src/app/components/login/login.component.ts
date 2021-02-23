import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
//import {AuthenticService} from '../service/authentic.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 loginForm=new FormGroup({
   email:new FormControl('',[Validators.required,Validators.email,Validators.minLength(6)]),
   password:new FormControl('',[Validators.required,Validators.minLength(3)])

 })

  constructor(
    ) {
    
     }

  ngOnInit(): void {
    
  }
  onSubmit()
  {
    console.warn(this.loginForm.value);
  }

}
