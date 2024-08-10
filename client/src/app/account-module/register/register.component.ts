import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../Services/auth-service.service';
import { IRegisterModel } from '../../../Models/registermodel';
import { error } from 'node:console';
import { catchError, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  protected _isAuthenticated: boolean = false;
  @ViewChild('notification') public notification: TemplateRef<any>;
  registerModel: IRegisterModel;
  showWrongInputs: boolean = false;
  notificationHeader: string;
  notificationMessage: string;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService, private router: Router,
      private modalService: NgbModal) { }

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe(data => this._isAuthenticated = data);
  }

  registerForm: FormGroup = this.formBuilder.group({
    displayName: [''],
    email: [''],
    password: ['']
  });

  onRegister() {
    this.registerModel = this.registerForm.value;
    this.authService.register(this.registerModel).pipe(take(1)).subscribe({
      next: (x) => {

        this.runModalNotifServices()
      },
      error: (error) => {
        this.showWrongInputs = true;
      },
      complete: () => {
      }
    })
  }

  onInputTyping() {
    this.showWrongInputs = false;
  }

  runModalNotifServices() {
    this.notificationHeader = "Account Created";
    this.notificationMessage = "Account creation success. Redirecting you to login page."
    this.openModalNotif(this.notification);
    setTimeout(() => {
      this.closeModalNotif(this.notification);
      this.router.navigateByUrl("/account/login");
    }, 2000);
  }

  openModalNotif(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  closeModalNotif(content: TemplateRef<any>) {
    this.modalService.dismissAll(content);
  }
}
