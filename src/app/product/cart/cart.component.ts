import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { CartsService } from 'src/app/__helper/carts/carts.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  baseURL = environment.baseURL;

  constructor(public cartS: CartsService, public appC: AppComponent, public title: Title) {
    title.setTitle("Shopping Cart - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
  }

  updateCarts(items: any, num: any){
    this.cartS.updateCarts(items, num);
    if(num !== 0){
      this.appC.successStackBar("Update your cart.");
    }
  }

  removeProduct(items: any){
    this.cartS.removeSingleProduct(items);
  }

}
