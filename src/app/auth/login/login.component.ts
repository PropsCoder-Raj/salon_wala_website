import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  loading = false;
  returnUrl = '';
  showHidePassword = false;

  constructor(public router: Router, public toastr: ToastrService, public authS: AuthService, private title: Title, public socialAuthService: SocialAuthService, public userS: UserService) {
    this.title.setTitle("Login - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(user => {
      this.userS.getFindbyEmail(user.email).subscribe(data => {
        if (data['status'] === 'success') {
          this.authS.userSignInGoogleFacebook(user.email).subscribe((result) => {
            this.toastr.success("User Login Successfully.")
            this.loading = false;
            window.location.replace(this.returnUrl);
          })
        } else if (data['status'] === 'error') {
          this.authS.userSignUpFacebook(user.firstName, user.lastName, user.email).subscribe((result) => {
            this.toastr.success("User Login Successfully.")
            this.loading = false;
            window.location.replace(this.returnUrl);
          })
        }
      })
    })
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((user) => {
        this.userS.getFindbyEmail(user.email).subscribe(data => {
          if (data['status'] === 'success') {
            console.log(data);
            // this.authS.userSignInGoogleFacebook(user.email).subscribe((result) => {
            //   this.toastr.success("User Login Successfully.")
            //   this.loading = false;
            //   window.location.replace(this.returnUrl);
            // })
          } else if (data['status'] === 'error') {
            this.authS.userSignUpGoogle(user.firstName, user.lastName, user.email).subscribe((result) => {
              this.toastr.success("User Login Successfully.")
              this.loading = false;
              window.location.replace(this.returnUrl);
            })
          }
        })
      });
  }

  logout(){
    this.socialAuthService.signOut();
  }

  login() {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.email != '' && this.password != '') {
      if (re.test(this.email) == false) {
        this.toastr.error('Please ! Enter valid Email');
      } else {
        this.loading = true;
        this.authS.userSignIn(this.email, this.password).pipe(first()).subscribe(data => {
          this.toastr.success("User Login Successfully.")
          this.loading = false;
          window.location.replace(this.returnUrl);
        },
          error => {
            if (error.status == "0") {
              this.toastr.error(error.statusText);
            } else {
              this.toastr.error(error);
            }
            this.loading = false;
          });
      }
    } else {
      this.toastr.error('All Fields are Mendatory');
    }
  }

}
