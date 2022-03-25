import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/__helper/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  salutation = '';
  firstName = '';
  lastName = '';
  mobile: any;
  email = '';
  password = '';
  dob: any;
  mendatoryS = false;

  showHidePassword = false;
  arr = [
    { name: "Mr.", checked: false },
    { name: "Mrs.", checked: false }
  ];
  returnUrl = '';
  loading = false;

  constructor(public toastr: ToastrService, public authS: AuthService, public router: Router, private title: Title) {
    title.setTitle("Register - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
  }

  register() {
    if (this.firstName !== '' && this.lastName !== '' && this.salutation !== '' && this.mobile !== '' && this.email !== '' && this.password !== '') {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const phLength = new String(this.password);
      if (re.test(this.email) == false) {
        this.toastr.error('Please ! Enter valid Email');
      } else if (phLength.length < 8) {
        this.toastr.error('Please ! Enter password 8 length');
      } else {
        this.loading = true;
        let today;
        if(this.dob !== '' && this.dob !== undefined && this.dob !== null){
          today = new Date(this.dob);
        }else{
          today = null;
        }

        this.authS.userSignUp(this.salutation, this.firstName, this.lastName, this.email, this.mobile, today, this.password).pipe(first()).subscribe(data => {
            this.router.navigateByUrl(this.returnUrl);
            this.loading = false;
        },
          error => {
            this.loading = false;
            if (error.status == "0") {
              this.toastr.error(error);
            } else {
              this.toastr.error(error);
            }
          });

      }
    } else {
      this.mendatoryS = true;
      this.toastr.error("Please Fill Mendator Field");
    }
  }

  contentType(event: any) {
    var optionsRadios: any = document.getElementsByName('optionsRadios');
    for (var i = 0, length = optionsRadios.length; i < length; i++) {
      if (optionsRadios[i].checked) {
        this.salutation = optionsRadios[i].value;
        break;
      }
    }
  }

}
