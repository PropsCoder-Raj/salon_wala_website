import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { CartsService } from 'src/app/__helper/carts/carts.service';
import { DataService } from 'src/app/__helper/data/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  value: number = 20;
  highValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 100,
    hideLimitLabels:true
  };

  productsData: Array<any> = [];
  productsCount = 0;
  baseURL = environment.baseURL;
  constructor(public apiS: ApiService,public route: ActivatedRoute,public authS: AuthService, public router: Router, public cartS: CartsService, public appC: AppComponent, public dataS: DataService, public title: Title) {
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    if(this.dataS.productsList !== undefined){
      this.productsData = this.dataS.productsList;
    }else{
      this.getData();
    }
  }

  getData(){
    this.productsData = [];
    this.productsCount = 0;
    this.route.params.subscribe(apiData => {
      this.title.setTitle(apiData['name'] +" Products List - Salon-Wala.com");
      this.apiS.getSubtSubCategoryWiseProduct(apiData['id']).subscribe(data => {
        this.productsCount = data['count'];
        this.productsData = [];
        data['data'].forEach((element: any) => {
          let str = element['description'];
          this.apiS.getRatingsProductsWise(element['_id']).subscribe((rating: any) => {
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
              this.productsData.push({ data: element, rating: ratingProducts,  desc: str.replaceAll("<p>&nbsp;</p>", ""), singleSesc: str.replaceAll("<p>&nbsp;</p>", "").substr(0, 200) + '.....' });
            } else {
              this.productsData.push({ data: element, rating: 0, desc: str.replaceAll("<p>&nbsp;</p>", ""), singleSesc: str.replaceAll("<p>&nbsp;</p>", "").substr(0, 200) + '.....' });
            }
          });
        });

        let interval = setInterval(() => {
          if(this.productsData.length === data['data'].length){
              clearInterval(interval);
              this.dataS.productsList = this.productsData;
          }
        }, 1000);

        this.productsCount = data['count'];
      })
    });
  }

  addProducts(items: any, num: any){
    if(this.authS.currentUserValue !== null && this.authS.currentUserValue !== undefined){
      this.cartS.addCarts(items, num);
      this.appC.successStackBar("Successfully add product your cart.")
    }else{
      this.appC.errorStackBar("Please first login.");
    }
  }

  productsDetails(name: any, id: any, subsubcategories: any){
    name = encodeURIComponent(name).replace(/%20/g, "-")
    name = encodeURIComponent(name).replace('(', "");
    name = encodeURIComponent(name).replace(')', "");
    this.router.navigate(['/product/'+ name + '/' + id+'/'+ subsubcategories]);
  }

}
