import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';
import { formatDate } from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  salutation = '';
  firstName = '';
  lastName = '';
  mobile: any;
  email = '';
  password = '';
  dob: any;
  
  arr = [
    { name: "Mr.", checked: false },
    { name: "Mrs.", checked: false }
  ];

  constructor(public authS: AuthService, public userS: UserService, public toastr: ToastrService, public title: Title) {
    title.setTitle("Profile - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo(){
    this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe(data => {
      console.log(data);
      this.salutation = data['data']['salutation'];
      this.firstName = data['data']['firstName'];
      this.lastName = data['data']['lastName'];
      this.mobile = data['data']['mobile'];
      this.password = data['data']['password'];
      this.email = data['data']['email'];
      this.dob = formatDate(data['data']['dob'], "yyyy-MM-dd", 'en-US');
      setTimeout(() => {
        $('input:radio[name="optionsRadios"]').filter('[value="'+ this.salutation +'"]').attr('checked', true);
      }, 500);
    });
  }

  contentType(event: any){
    var optionsRadios: any = document.getElementsByName('optionsRadios');
    for (var i = 0, length = optionsRadios.length; i < length; i++) {
      if (optionsRadios[i].checked) {
        this.salutation = optionsRadios[i].value;
        break;
      }
    }
  }

  updateUser(){
    let today = new Date(this.dob);
    this.userS.updateUser(this.authS.currentUserValue.id, this.firstName, this.lastName, this.email, this.mobile, today, this.salutation).subscribe(data => {
      if(data['status'] === 'success'){
        this.toastr.success("User Update Successfully.");
        location.reload();
      }
    });
  }

}
