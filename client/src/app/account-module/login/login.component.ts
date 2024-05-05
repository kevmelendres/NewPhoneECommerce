import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../Services/auth-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  loginForm: FormGroup = this.formBuilder.group({
    email: [''],
    password: ['']
  });

  onLoginClick() {
    this.authService.loginUser(this.loginForm.value);
    if (this.authService.isAuthenticatedUser()) {
      this.router.navigate(["/shop"]);
    }
  }
}
