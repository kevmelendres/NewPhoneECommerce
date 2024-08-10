import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../Services/auth-service.service';
import { Router } from '@angular/router';
import { Observable, concatMap, firstValueFrom, lastValueFrom, map, of, switchMap, take, tap } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  @ViewChild("pageWrapper", { static: true }) pageWrapper: ElementRef;
  renderPage: boolean = false;

  showIncorrectLogin: boolean = false;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router,
    private renderer: Renderer2) {
  }
  protected _isAuthenticated: boolean = false;

  ngOnInit(): void {
    this.authService.initializeComponentLogin().subscribe(data => {
      if (typeof data !== "boolean") {
        this._isAuthenticated = true;
      } else {
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

      if (!isLoggedIn) {
        this.showIncorrectLogin = true;
      }

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

    this.showIncorrectLogin = false;
  }

}
