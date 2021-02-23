import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});

  constructor() {

  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    {
      // check whether password and confirm password match
        validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('password');
    const confPass = control.get('confirmPassword');
    return pass?.value !== confPass?.value ? {mismatch: true} : null;
  }

  onSubmit(): void {
   console.warn(this.registerForm.value);
  }


}
