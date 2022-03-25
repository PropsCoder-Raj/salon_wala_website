import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { CartsService } from 'src/app/__helper/carts/carts.service';
import { UserService } from 'src/app/__helper/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  products : any = [];
  baseURL = environment.baseURL;

  constructor(public authS: AuthService, public userS: UserService, public cartS: CartsService, public appC: AppComponent, public title: Title) {
    title.setTitle("Wishlist - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist(){
    this.userS.getWishlist(this.authS.currentUserValue.id).subscribe(data => {
      this.products = data['data'];
    })
  }

  addProducts(items: any, num: any){
      this.cartS.addCarts(items, num);
      this.appC.successStackBar("Successfully add product your cart.")
  }

  removeProducts(name: any, index: any){
    this.products.splice(this.products.indexOf(name), index);
    console.log(this.products);
  }

}
