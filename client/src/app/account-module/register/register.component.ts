import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../Services/auth-service.service';
import { IRegisterModel } from '../../../Models/registermodel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  registerModel: IRegisterModel;

  registerForm: FormGroup = this.formBuilder.group({
    displayName: [''],
    email: [''],
    password: ['']
  });

  onRegister() {
    this.registerModel = this.registerForm.value;
    this.authService.register(this.registerModel);
  }
  
}
