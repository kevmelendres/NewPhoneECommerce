import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth-service.service';


@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.scss'
})
export class TopHeaderComponent implements OnInit{
  isAdmin: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isAdminBS.subscribe(isAdmin => this.isAdmin = isAdmin)

  }
}
