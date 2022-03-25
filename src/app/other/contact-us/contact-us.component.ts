import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  name = '';
  email = '';
  subject = '';
  message = '';


  constructor(public title: Title, public apiS: ApiService, public userS: UserService, public auth: AuthService, public appC: AppComponent) {
    title.setTitle("Contact Us - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.userS.getSigleUser(this.auth.currentUserValue.id).subscribe(data => {
      this.name = data['data']['firstName'] + ' ' + data['data']['lastName'];
      this.email = data['data']['email'];
    });
  }

  createContact(){
    this.apiS.createContact(this.name, this.email, this.subject, this.message).subscribe(data => {
      if(data['status'] == 'success'){
        this.appC.successStackBar("Successfully Contact.");
        window.location.reload();
      }
    })
  }

  clear(){
    this.name = '';
    this.email = '';
    this.subject = '';
    this.message = '';
  }

}
