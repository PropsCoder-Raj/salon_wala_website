import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class CartsService {

  public carts: Array<any> = [];
  totalAmount = 0;
  discountAmount = 0;
  discountPercentage = 0;
  cartAmount = 0;
  deliveryCharges = 0;
  taxesAmount = 0;
  totalPayAmount = 0;
  finalTotalPayAmount = 0
  balance = 0;

  walletPaymentStatus: any;
  cutBalance = 0;
  walletAction = false;
  remainingBalance = 0;

  constructor(public userS: UserService, public authS: AuthService, public apiS: ApiService) {
    if(localStorage.getItem("carts") !== null && localStorage.getItem("carts") !== undefined){
      this.getBalance();
      let data: any = localStorage.getItem("carts");
      this.carts = JSON.parse(data);
      setTimeout(() => {
        this.calculateTotal();
        this.calculateBalance();
        if (this.balance > 0) {
          this.walletAction = true;
        } else {
          this.walletAction = false;
        }
      }, 1000);
    }else{
      this.carts = [];
    }
  }

  getBalance() {
    this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe((data) => {
      if (data['status'] === 'success') {
        this.balance = data['data']['balance'];
      }
    });
  }

  discountApply(){
    this.discountAmount = ( this.totalPayAmount / 100 ) * this.discountPercentage;
    this.calculateTotal();
    this.calculateBalance();
  }

  calculateBalance() {
    if (this.totalPayAmount > this.balance) {
      this.walletPaymentStatus = 'greaterThan';
      this.cutBalance = this.balance;
      this.remainingBalance = 0;
      this.finalTotalPayAmount = Number(this.totalPayAmount) - Number(this.balance);
    } else if (this.totalPayAmount === this.balance) {
      this.walletPaymentStatus = 'isEqual';
      this.finalTotalPayAmount = this.totalPayAmount;
      this.cutBalance = this.balance;
      this.remainingBalance = 0;
    } else if (this.totalPayAmount < this.balance) {
      this.walletPaymentStatus = 'lessThan';
      this.finalTotalPayAmount = this.totalPayAmount;
      this.cutBalance = this.finalTotalPayAmount;
      this.remainingBalance = this.balance - this.finalTotalPayAmount;
    }
    if (this.balance > 0) {
      this.walletAction = true;
    } else {
      this.walletAction = false;
    }

    setTimeout(() => {
      console.log("walletPaymentStatus: "+ this.walletPaymentStatus)
      console.log("cutBalance: "+ this.cutBalance)
      console.log("remainingBalance: "+ this.remainingBalance)
      console.log("finalTotalPayAmount: "+ this.finalTotalPayAmount)
    }, 500);
  }

  calculateTotal(){
    this.totalAmount = 0;
    this.taxesAmount = 0;
    if(this.carts.length > 0){
      this.carts.forEach(element => {
        this.totalAmount = this.totalAmount + (element['price'] * element['num']);
        console.log(element['taxesArr']);
        element['taxesArr'].forEach((taxes: any) => {
        console.log(taxes);
          this.taxesAmount = this.taxesAmount + taxes['taxAmount'];
        });
      });
    }
    console.log(this.taxesAmount);
    this.cartAmount = this.totalAmount - this.discountAmount + Number(this.taxesAmount);
    this.totalPayAmount = this.cartAmount + this.deliveryCharges;
  }

  addCarts(items: any, number: any){
    let taxes : Array<any> = [];
    const productExistInCart = this.carts.find(({ _id }) => _id === items._id);
    if (!productExistInCart) {
      let priceProdcuts = items['price'] * 1;
      let percentageProduct = priceProdcuts / 100;
      let cnt = 0;
      if(items['taxes'].length > 0){
        items['taxes'].forEach((element: any) => {
          this.apiS.getSingleTax(element['_id']).subscribe(data => {
            let taxPercentageAmount =  Number(percentageProduct) * Number(data['data'][0]['percentage']);
            taxes.push({data: data['data'][0], taxAmount: taxPercentageAmount});        
          });
        });  
      }
      let interval = setInterval(() =>{
        if(items['taxes'].length === taxes.length){
          clearInterval(interval);
          this.carts.push({ ...items, num: number, cnt: number, taxesArr: taxes }); // enhance "porduct" opject with "num" property
          localStorage.setItem("carts", JSON.stringify(this.carts));
          console.log(this.carts)
          this.calculateTotal();
          this.calculateBalance();
          return;
        }
      }, 1000)
    }

    productExistInCart.num += number;

    let taxesArray : Array<any> = [];
    let _priceProdcuts = productExistInCart.price * productExistInCart.num;
    let _percentageProduct = _priceProdcuts / 100;
    productExistInCart.taxesArr.forEach((element: any) => {
      let _taxPercentageAmount =  Number(_percentageProduct) * Number(element['data']['percentage']);
      taxesArray.push({data: element['data'], taxAmount: _taxPercentageAmount}); 
    });
    productExistInCart.taxesArr = taxesArray;

    let interval = setInterval(() =>{ 
      if(taxesArray.length === productExistInCart.taxesArr.length){
        clearInterval(interval);
        localStorage.setItem("carts", JSON.stringify(this.carts));
        console.log(this.carts)
        this.calculateTotal();
        this.calculateBalance();
      }
    }, 1000);
  }

  updateCarts(items: any, number: any){
    const productExistInCart = this.carts.find(({ _id }) => _id === items._id);
    if (!productExistInCart) {
      this.carts.push({ ...items, num: number, cnt: number }); // enhance "porduct" opject with "num" property
      localStorage.setItem("carts", JSON.stringify(this.carts));
      return;
    }
    productExistInCart.num = number;
    
    let taxesArray : Array<any> = [];
    let _priceProdcuts = productExistInCart.price * productExistInCart.num;
    let _percentageProduct = _priceProdcuts / 100;
    productExistInCart.taxesArr.forEach((element: any) => {
      let _taxPercentageAmount =  Number(_percentageProduct) * Number(element['data']['percentage']);
      taxesArray.push({data: element['data'], taxAmount: _taxPercentageAmount}); 
    });
    productExistInCart.taxesArr = taxesArray;

    if(productExistInCart.num === 0){
      this.carts = this.carts.filter(
        ({ id }) => id !== items.id,
      );
      if(this.carts.length === 0){
        localStorage.removeItem("carts");
        this.clearFilter();
      }
      return;
    }

    localStorage.setItem("carts", JSON.stringify(this.carts));
    console.log(this.carts);
    this.calculateTotal();
    this.calculateBalance();
  }

  getCount(items: any){
    if(this.carts.length > 0){
      const productExistInCart = this.carts.find(({ _id }) => _id === items._id);
      if(productExistInCart === undefined){
        return 0
      }else{
        return productExistInCart.num;
      }
    }else{
      return 0;
    }
  }

  removeProduct(items: any) {
    const productExistInCartOther = this.carts.find(({ _id }) => _id === items._id);
    productExistInCartOther.num--;
    productExistInCartOther.cnt--;
    this.calculateTotal();
    this.calculateBalance();

    if(productExistInCartOther.num === 0){
      this.carts = this.carts.filter(
        ({ id }) => id !== items.id,
      );
      if(this.carts.length === 0){
        localStorage.removeItem("carts");
        this.clearFilter();
      }
      return;
    }

    localStorage.setItem("carts", JSON.stringify(this.carts));
  }

  removeSingleProduct(items: any) {
      this.carts = this.carts.filter(
        ({ _id }) => _id !== items._id,
      );
      if(this.carts.length === 0){
        localStorage.removeItem("carts");
        this.clearFilter();
      }
      this.calculateTotal();
      this.calculateBalance();
      localStorage.setItem("carts", JSON.stringify(this.carts));
  }

  clearFilter(){
    this.remainingBalance = 0;
    this.totalPayAmount = 0;
    this.cutBalance = 0;
    this.finalTotalPayAmount = 0
    this.discountAmount = 0;
    this.discountPercentage = 0;
  }
}
