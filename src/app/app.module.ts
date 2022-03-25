import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragScrollModule } from 'ngx-drag-scroll';
import { AuthService } from './__helper/auth/auth.service';
import { UserService } from './__helper/user/user.service';
import { ApiService } from './__helper/api/api.service';


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptorInterceptor } from './__helper/other/error-interceptor.interceptor';
import { JwtInterceptorInterceptor } from './__helper/other/jwt-interceptor.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { DataService } from './__helper/data/data.service';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ServiceCartsService } from './__helper/service-carts/service-carts.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { LoginComponent } from './auth/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    DragScrollModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    AuthService, UserService, ApiService, DataService, ServiceCartsService, SocialAuthService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true, //keeps the user signed in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('12997840760-gm23hjqkapaddc2dbrqfofl8hi19u159.apps.googleusercontent.com') // your client id
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              '313997830777254'
            )
          }
        ]
      }
    }, SocialAuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
