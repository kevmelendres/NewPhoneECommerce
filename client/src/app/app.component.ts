import { Component, Output } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
  renderHeaders: boolean;

  constructor() {

  }

  onRouterOutletActivate(data: any) {
    this.toRenderHeaders(data.constructor.name);
  }

  toRenderHeaders(componentLoaded: String) {
    this.renderHeaders = !(componentLoaded == '_LoginComponent' || componentLoaded == '_RegisterComponent')
  }
}
