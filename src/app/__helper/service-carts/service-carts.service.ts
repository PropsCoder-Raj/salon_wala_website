import { Injectable, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceCartsService implements OnInit {

  public carts: Array<any> = [];
  serviceCartSubtotal = 0;
  discountAmount = 0;
  totalPayAmount = 0;
  discountPercentage = 0;
  totalTimeConsume = 0;
  bookingsComments = '';

  sendDataArray: Array<any> = [];

  constructor(public userS: UserService, public authS: AuthService, public apiS: ApiService) {
    if (localStorage.getItem("serviceCart") !== null && localStorage.getItem("serviceCart") !== undefined) {
      let array: Array<any> = [];
      let data: any = localStorage.getItem("serviceCart");
      array = JSON.parse(data);
      this.carts = array;
      setTimeout(() => {
        this.calculateAmount();
      }, 1000);
    }
  }

  discountApply() {
    this.discountAmount = (this.serviceCartSubtotal / 100) * this.discountPercentage;
    this.calculateAmount();
  }

  ngOnInit(): void {
    if (localStorage.getItem("serviceCart") !== null && localStorage.getItem("serviceCart") !== undefined) {
      let array: Array<any> = [];
      let data: any = localStorage.getItem("serviceCart");
      array = JSON.parse(data);
      this.carts.push(array);
      setTimeout(() => {
        this.calculateAmount();
      }, 1000);
    }
  }

  calculateAmount() {
    this.clear();
    if (this.carts.length > 0) {
      let myPromise = new Promise((resolve: any, reject: any) => {
        this.carts.forEach((element, index, array) => {
          let discountPercentage = this.discountPercentage;
          let discountAmount = this.discountAmount;
          let commission = 0;
          let commissionPercentage = 0;
          let priceCutWithCommision = 0;
          this.userS.getSigleUser(element['user']).subscribe(data => {
            if(data['data']){
              let price = element['service']['price'];
              commissionPercentage = data['data']['commission'];
              commission = (price / 100) * commissionPercentage;
              priceCutWithCommision = (price - commission) - discountAmount;
              this.sendDataArray.push({
                name: element['data']['name'],
                price: element['service']['price'],
                desc: element['data']['description'],
                time: element['service']['time'],
                _id: element['data']['_id'],
                _shopUser: element['service']['user'],
                media: element['data']['media'],
                "discountAmount": discountAmount, 
                "discountPercentage": discountPercentage, 
                "commissionAmount": commission, 
                "commissionPercentage": commissionPercentage, 
                "priceCutWithCommision": priceCutWithCommision
              });
              console.log(this.sendDataArray);

              this.bookingsComments = this.bookingsComments + element['data']['name'];
            }
          });  
          if (this.totalTimeConsume < Number(element['service']['time'])) {
            let getMinutes = Number(element['service']['time']);
            this.totalTimeConsume = (Math.round(getMinutes/15) * 15) % 60;
          }
          this.serviceCartSubtotal = this.serviceCartSubtotal + element['service']['price'];

          if (index == array.length - 1) resolve();
        });
      })
      myPromise.then(() => {
        this.totalPayAmount = this.serviceCartSubtotal - this.discountAmount;
      });
    } else {
      this.clear();
    }
  }

  clear() {
    this.serviceCartSubtotal = 0;
    this.totalPayAmount = 0;
    this.sendDataArray = [];
  }

  addCarts(item: any) {
    this.carts = item;
    setTimeout(() => {
      this.calculateAmount();
    }, 1000);
  }

  allClearFirlds(){
    localStorage.removeItem("serviceCart");
    this.carts = [];
    this.serviceCartSubtotal = 0;
    this.totalPayAmount = 0;
    this.discountAmount = 0;
    this.discountPercentage = 0;
    this.sendDataArray = [];
  }

  removeCarts(item: any) {
    this.carts = this.carts.filter(
      ({ id }) => id !== item.id,
    );
    if (this.carts.length > 0) {
      localStorage.setItem("serviceCart", JSON.stringify(this.carts));
    } else {
      localStorage.removeItem("serviceCart");
    }
    this.calculateAmount();
  }
}
