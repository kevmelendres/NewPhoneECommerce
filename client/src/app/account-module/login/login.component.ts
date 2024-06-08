import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../Services/auth-service.service';
import { Router } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }
  protected _isAuthenticated: boolean = false;
  protected renderPage: boolean = false;

  ngOnInit(): void {
    //this.authService.isAuthenticated.subscribe(data => {
    //  this._isAuthenticated = data;
    //  if (this._isAuthenticated) {
    //    console.log("redirect from login");
    //    this.router.navigateByUrl("/home");
    //  }

    //  if (!this._isAuthenticated) {
    //    this.renderPage = true;
    //  }
    //});

    this.authService.initialLoginUser().subscribe(isLoggedIn => {
      this._isAuthenticated = isLoggedIn;

      if (this._isAuthenticated) {
        console.log("redirect from login");
        this.router.navigateByUrl("/home");
      }

      if (!this._isAuthenticated) {
        this.renderPage = true;
      }
    });
  }

  loginForm: FormGroup = this.formBuilder.group({
    email: [''],
    password: ['']
  });

  onLoginClick() {
    this.authService.loginUser(this.loginForm.value).subscribe(isLoggedIn => {
      this._isAuthenticated = isLoggedIn;
      if (isLoggedIn) {
        this.router.navigate(["/shop"]);
      }
    });
  }

  onInputTyping(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.onLoginClick();
    }
  }
}
