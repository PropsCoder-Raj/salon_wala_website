import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';
import * as bcrypt from "bcryptjs";
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
// declare var bcrypt: any;

@Component({
  selector: 'app-change-passowrd',
  templateUrl: './change-passowrd.component.html',
  styleUrls: ['./change-passowrd.component.scss']
})
export class ChangePassowrdComponent implements OnInit {

  password = '';
  newpassword = '';
  confirmpassword = '';

  dbpassword = '';
  loading = false;
  showHideNewPassword = false;
  showHideConfirmPassword = false;

  constructor(public userS: UserService, public authS: AuthService, public appC: AppComponent, public router: Router, public title: Title) {
    title.setTitle("Change Password - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo(){
    this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe(data => {
      console.log(data);
      this.dbpassword = data['data']['password'];
      // bcrypt.compareSync('12345678', '$2a$08$Al5mUtYAioposrBuYc2pOeJLWd0GjPyUuEfI.yicaH2XR8GKX.A7W')
    });
  }

  changePassword(){
    if(bcrypt.compareSync(this.password.toString(), this.dbpassword.toString())){
      if(this.newpassword === this.confirmpassword){
        this.loading = true;
        this.userS.changePassword(this.authS.currentUserValue.id, this.newpassword).subscribe(data => {
          if(data['status'] === 'success'){
            this.loading = false;
            this.appC.successStackBar("Password Changed");
            setTimeout(() => {
              this.clearFields();
              this.router.navigate(['/']).then(() => {
                location.reload();
              })
            }, 1000);
          }
        });
      }else{
        this.appC.errorStackBar("New & Confirm Password Not Match.");
      }
    }else{
      this.appC.errorStackBar("Current Password Don't Match.");
    }
  }

  clearFields(){
    this.password = '';
    this.newpassword = '';
    this.confirmpassword = '';
    this.dbpassword = '';
  }

}
