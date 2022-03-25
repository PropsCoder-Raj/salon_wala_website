import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {

  referralAmount = 0;
  code = '';

  constructor(public title: Title, public apiS: ApiService, public userS: UserService, public auth: AuthService, public appC: AppComponent) {
    title.setTitle("Refer & Earn - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.apiS.getSetting().subscribe(data =>{
      this.referralAmount = data['data'].amount;
    });
    
    this.userS.getSigleUser(this.auth.currentUserValue.id).subscribe(data=>{
      this.code = data['data']['code'];
    });
  }

  copyMessage(val: any) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.appC.successStackBar("Referral Code Copied!")
  }

}
