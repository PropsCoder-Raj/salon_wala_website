import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component';
import { ApiService } from '../__helper/api/api.service';
import { AuthService } from '../__helper/auth/auth.service';
import { CartsService } from '../__helper/carts/carts.service';
import { DataService } from '../__helper/data/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('dra', { read: DragScrollComponent }) ds!: DragScrollComponent;
  @ViewChild('cat', { read: DragScrollComponent }) ds1!: DragScrollComponent;

  topSliderMedia: any = [];
  belowSliderOffer: any = [];
  belowFeaturedProduct: any = [];
  brands: any = [];
  featuredProducts: Array<any> = [];
  baseURL = environment.baseURL;

  constructor(public authS: AuthService, private api: ApiService, public dataS: DataService, public router: Router, public cartS: CartsService, public appC: AppComponent, public title: Title) {
    title.setTitle("Home - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    if (this.dataS.topSliderMedia !== undefined && this.dataS.belowSliderOffer !== undefined && this.dataS.belowFeaturedProduct !== undefined && this.dataS.brands !== undefined) {
      this.topSliderMedia = this.dataS.topSliderMedia;
      this.belowSliderOffer = this.dataS.belowSliderOffer;
      this.belowFeaturedProduct = this.dataS.belowFeaturedProduct;
      this.brands = this.dataS.brands;
    } else {
      this.getBanners();
    }
    if (this.dataS.featuredProducts !== undefined) {
      this.featuredProducts = this.dataS.featuredProducts;
    } else {
      this.getFeaturedProducts();
    }
  }

  productsDetails(name: any, id: any, subSubCategory: any) {
    name = encodeURIComponent(name).replace(/%20/g, "-")
    name = encodeURIComponent(name).replace('(', "");
    name = encodeURIComponent(name).replace(')', "");
    this.router.navigate(['/product/' + name + '/' + id + '/' + subSubCategory]).then(() => {
      window.scroll(0, 0);
    });
  }

  getFeaturedProducts() {
    this.api.getProductFeatured().subscribe(data => {
      data['data'].forEach((element: any) => {
        this.api.getRatingsProductsWise(element['_id']).subscribe((rating: any) => {
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
            this.featuredProducts.push({ data: element, rating: ratingProducts });
          } else {
            this.featuredProducts.push({ data: element, rating: 0 });
          }
        });
      });
      let interval = setInterval(() => {
        console.log(this.featuredProducts);
        if (this.featuredProducts.length === data['data'].length) {
          clearInterval(interval);
          this.dataS.featuredProducts = this.featuredProducts;
          console.log(this.featuredProducts);
        }
      }, 1000);
      // this.featuredProducts = data['data'];
    })
  }


  getBanners() {
    this.api.getSingleBanner("61c451d85cf79e839166776b").subscribe(res => {
      this.topSliderMedia = res.data[0].media;
      this.dataS.topSliderMedia = this.topSliderMedia;
    });

    this.api.getSingleBanner("61c455a25cf79e83916678bf").subscribe(res => {
      this.belowSliderOffer = res.data[0].media;
      this.dataS.belowSliderOffer = this.belowSliderOffer;
    });

    this.api.getSingleBanner("61c456bd5cf79e83916679a3").subscribe(res => {
      this.belowFeaturedProduct = res.data[0].media;
      this.dataS.belowFeaturedProduct = this.belowFeaturedProduct;
    });

    this.api.getSingleBanner("61c457f75cf79e8391667a9a").subscribe(res => {
      this.brands = res.data[0].media;
      this.dataS.brands = this.brands;
    });
  }

  addProducts(items: any, num: any) {
    if (this.authS.currentUserValue !== null && this.authS.currentUserValue !== undefined) {
      this.cartS.addCarts(items, num);
      this.appC.successStackBar("Successfully add product your cart.")
    } else {
      this.appC.errorStackBar("Please first login.");
    }
  }

  moveLeft() {
    this.ds.moveLeft();
  }
  moveLeft1() {
    this.ds1.moveLeft();
  }
  moveRight() {
    this.ds.moveRight();
  }
  moveRight1() {
    this.ds1.moveRight();
  }
}
