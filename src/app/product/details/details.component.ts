import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { CartsService } from 'src/app/__helper/carts/carts.service';
import { UserService } from 'src/app/__helper/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @ViewChild('dra', { read: DragScrollComponent }) ds!: DragScrollComponent;
  @ViewChild('cat', { read: DragScrollComponent }) ds1!: DragScrollComponent;

  image = '';

  productsDetails: any = [];
  baseURL = environment.baseURL;
  public count = 1;
  wishlist: Array<any> = [];

  ratingApplyStatus = false;
  rating = 0;
  review = '';
  ratingStatus = false;
  ratingCount = 0;
  ratingProducts = 0;
  relatedProducts: any = [];

  constructor(public route: ActivatedRoute, public apiS: ApiService, public authS: AuthService, public cartS: CartsService, public appC: AppComponent, public userS: UserService, public router: Router, public title: Title) {
    window.scroll(0, 0);
  }

  change() {
    this.ratingStatus = true;
  }

  ngOnInit(): void {
    this.getDetails();
    this.getWishlist();
    this.reviewUserStatus();
    console.log(this.cartS.carts);
  }

  reviewUserStatus(){
    this.userS.getUserOrder(this.authS.currentUserValue.id).subscribe((data) => {
      if(data['data'].length > 0){
        this.route.params.subscribe(apiData => {
          data['data'].forEach((element: any) => {
            element['items'].forEach((items: any) => {
              console.log(items);
              if(items['productId'].toString() === apiData['id'].toString()){
                console.log("True");
                this.ratingApplyStatus = true;
              }
            });
          });
        });  
      }else{
        this.ratingApplyStatus = false;
      }
    })
  }

  getRatingCount(id: any) {
    this.ratingProducts = 0;
    let totalRating = 0;
    this.apiS.getRatingsProductsWise(id).subscribe(data => {
      this.ratingCount = data['count'];
      if (data['data'].length > 0) {
        data['data'].forEach((element: any) => {
          totalRating = totalRating + Number(element['rating']);
          this.ratingProducts = Math.round(Number(totalRating) / Number(this.ratingCount));
        });
      }
    });
  }

  setImage(img: any) {
    this.image = img;
  }

  addProducts(items: any, num: any) {
    if (this.authS.currentUserValue !== null && this.authS.currentUserValue !== undefined) {
      this.cartS.addCarts(items, num);
      this.appC.successStackBar("Successfully add product your cart.")
    } else {
      this.appC.errorStackBar("Please first login.");
    }
  }

  getRelatedProducts() {
    this.relatedProducts = [];
    this.apiS.getSubtSubCategoryWiseProduct(this.productsDetails['subsubcategories']).subscribe(data => {
      data['data'].forEach((element: any) => {
        let str = element['description'];
        this.apiS.getRatingsProductsWise(element['_id']).subscribe((rating: any) => {
          console.log(rating)
          let totalRating = 0;
          let ratingCount = 0;
          let ratingProducts = 0;
          ratingCount = rating['count'];
          if (rating['data'].length > 0) {
            let cnt = 0;
            rating['data'].forEach((element_1: any) => {
              cnt++;
              totalRating = totalRating + Number(element_1['rating']);
            });
            ratingProducts = Math.round(Number(totalRating) / Number(ratingCount));
            this.relatedProducts.push({ data: element, rating: ratingProducts, desc: str.replaceAll("<p>&nbsp;</p>", ""), singleSesc: str.replaceAll("<p>&nbsp;</p>", "").substr(0, 200) + '.....' });
          } else {
            this.relatedProducts.push({ data: element, rating: 0, desc: str.replaceAll("<p>&nbsp;</p>", ""), singleSesc: str.replaceAll("<p>&nbsp;</p>", "").substr(0, 200) + '.....' });
          }
        });
      });
    })
  }

  getWishlist() {
    if (this.authS.currentUserValue !== null && this.authS.currentUserValue !== undefined) {
      this.userS.getWishlist(this.authS.currentUserValue.id).subscribe(data => {
        if (data['data'].length > 0) {
          data['data'].forEach((element: any) => {
            this.wishlist.push(element['_id'].toString());
          });
        }
      });
    }
  }

  getDetails() {
    this.route.params.subscribe(apiData => {
      this.apiS.getSingleProduct(apiData['id']).subscribe(data => {
        this.productsDetails = data['data'][0];
        this.title.setTitle(this.productsDetails.name + " Product - Salon-Wala.com");
        this.getRelatedProducts();
        this.setImage(data['data'][0]['media'][0]['url'])
        this.getRatingCount(data['data'][0]['_id']);
      });
    })
  }

  addCart(item: Array<any>) {
    if (this.authS.currentUserValue !== null && this.authS.currentUserValue !== undefined) {
      this.cartS.addCarts(item, this.count);
      this.appC.successStackBar("Successfully add product your cart.")
    } else {
      this.appC.errorStackBar("Please first login.");
    }
  }

  addWishlist() {
    if (this.authS.currentUserValue !== null && this.authS.currentUserValue !== undefined) {
      this.wishlist.push(this.productsDetails['_id'].toString());
      this.userS.updateWishlist(this.authS.currentUserValue.id, this.wishlist).subscribe(data => {
        if (data['status'] === 'success') {
          this.appC.successStackBar("Addwd to wishlist");
        }
      });
    } else {
      this.appC.errorStackBar("Please first login.");
    }
  }

  addRatings() {
    if (this.authS.currentUserValue !== null && this.authS.currentUserValue !== undefined) {
      this.apiS.createRatings(this.authS.currentUserValue.id, Number(this.rating), this.productsDetails['_id'], this.review.toString()).subscribe(data => {
        if (data['status'] === 'success') {
          this.appC.successStackBar("Add Your Reviews");
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      });
    } else {
      this.appC.errorStackBar("Please first login.");
    }
  }

  productsD(name: any, id: any, subsubcategories: any) {
    name = encodeURIComponent(name).replace(/%20/g, "-")
    name = encodeURIComponent(name).replace('(', "");
    name = encodeURIComponent(name).replace(')', "");
    this.router.navigate(['/product/' + name + '/' + id + '/'+ subsubcategories]).then(() => {
      window.scroll(0, 0);
    });
  }

  moveLeft() {
    this.ds.moveLeft();
  }
  moveRight() {
    this.ds.moveRight();
  }
  moveLeft1() {
    this.ds1.moveLeft();
  }
  moveRight1() {
    this.ds1.moveRight();
  }
}
