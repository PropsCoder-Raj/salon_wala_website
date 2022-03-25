import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  ordersList: Array<any> = [];
  ordersCount = 0;
  name = '';
  baseURL = environment.baseURL;

  constructor(public userS: UserService, public authS: AuthService, public apiS: ApiService, public title: Title) {
    title.setTitle("Orders - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.getOrders();
    this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe(data => {
      this.name = data['data']['firstName'] + ' ' + data['data']['lastName'];
    });
  }

  getOrders(){
    this.userS.getUserOrder(this.authS.currentUserValue.id).subscribe(data => {
      if(data['data'].length > 0){
        this.ordersCount = data['data'].length;
        data['data'].forEach((element: any) => {
          let products : Array<any> = [];
          let cnt = 0;
          element['items'].forEach((items: any) => {
            cnt++;
            console.log(items);
            this.apiS.getSingleProduct(items['productId']).subscribe(product => {
              products.push({data : product['data'][0], qty: items['quantity'], taxes : items['taxes']});
            });
          });

          let interval = setInterval(() => {
            if(cnt === element['items'].length){
              clearInterval(interval);
              this.ordersList.push({ data: element, products: products })
              console.log(this.ordersList);
            }
          });
        });
      }else{
        this.ordersCount = 0;
      }  
    });  
  }

}
