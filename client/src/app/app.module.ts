import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule, NgbPopoverModule, NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TopHeaderComponent } from './top-header/top-header.component';
import { SearchBarComponent } from './header/search-bar/search-bar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HomeModule } from './home-module/home-module.module';
import { AccountModule } from './account-module/account.module';
import { HowtobuyModule } from './howtobuy-module/howtobuy.module';
import { ProductsFooterComponent } from './products-footer/products-footer.component';
import { FooterItemComponent } from './products-footer/footer-item/footer-item.component';
import { SiteFooterComponent } from './site-footer/site-footer.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TopHeaderComponent,
    SearchBarComponent,
    ProductsFooterComponent,
    FooterItemComponent,
    SiteFooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    NgbToastModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgbPopoverModule,
    NgbTooltipModule,
    HomeModule,
    AccountModule,
    HowtobuyModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
