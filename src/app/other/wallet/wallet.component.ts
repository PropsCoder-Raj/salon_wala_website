import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  balance = 0;
  transactions : Array<any> = [];
  transactionsCount = 0;

  constructor(public title: Title, public userS: UserService, public auth: AuthService, public apiS: ApiService) {
    title.setTitle("Wallet - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.userS.getSigleUser(this.auth.currentUserValue.id).subscribe(data=>{
      this.balance = data['data']['balance'];
    });

    this.apiS.getTransaction(this.auth.currentUserValue.id).subscribe(data=>{
      if(data['data'].length > 0){
        this.transactions = data['data'];
        this.transactionsCount++;
      }
    }); 
  }

}
