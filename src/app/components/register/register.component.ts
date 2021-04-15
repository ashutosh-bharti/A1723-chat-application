import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup , FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import { AuthenticService } from 'src/app/services/authentic.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() loginEvent = new EventEmitter<number>();

  registerForm: FormGroup = new FormGroup({});

  constructor(private auth: AuthenticService) {  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
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
   this.auth.register(this.registerForm.value)
      .subscribe(
        (res: any) => {
          this.auth.user = res;
          this.loginEvent.emit(res.id);
        },
        (error: any) => {
          alert('User Not Created!');
          console.warn('Something went wrong!');
        }
      );
  }


}
