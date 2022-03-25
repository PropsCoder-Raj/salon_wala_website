import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/__helper/api/api.service';
import { ServiceCartsService } from 'src/app/__helper/service-carts/service-carts.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-providers-details',
  templateUrl: './providers-details.component.html',
  styleUrls: ['./providers-details.component.scss']
})
export class ProvidersDetailsComponent implements OnInit {

  id = '';
  shopName = '';

  servicesList: Array<any> = [];
  baseURL = environment.baseURL;

  constructor(public apiS: ApiService, public route: ActivatedRoute, public appC: AppComponent, public serviceCartS: ServiceCartsService, public title: Title) {
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.getData();
    })
  }

  getData() {
    this.apiS.getServiceVendor(this.id).subscribe(data => {
      this.shopName = data['data']['shopName'];
      this.title.setTitle(this.shopName + " Shop - Salon-Wala.com");
    })
    this.apiS.getVendorServiceProducts(this.id).subscribe(data => {
      data['data'].forEach((element: any) => {
        this.apiS.getSingleServiceProduct(element['serviceProduct'][0]).subscribe(serviceData => {
          this.servicesList.push({ data: serviceData['data'][0], service: element, check: false, hideShowStatus: false });
          console.log(this.servicesList);
        })
      });
    })
  }

  deselected(item : any){
    let array: Array<any> = [];
    array.push({ ...item, id: item.data._id, user: item.service.user });
    console.log(array);
    this.serviceCartS.removeCarts(array[0]);
  }

  checkIsAvailable(item: any) {
    let userId = '';
    if (localStorage.getItem("serviceCart") !== null && localStorage.getItem("serviceCart") !== undefined) {
      let array: Array<any> = [];
      let data: any = localStorage.getItem("serviceCart");
      array = JSON.parse(data);
      const serviceExistInCart_1 = array.find(({ id, user }) => id === item._id && user === this.id);

      if (serviceExistInCart_1) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  addService(item: any) {
    let array: Array<any> = [];
    if (localStorage.getItem("serviceCart") !== null && localStorage.getItem("serviceCart") !== undefined) {
      let data: any = localStorage.getItem("serviceCart");
      array = JSON.parse(data);
      const serviceExistInCart_1 = array.find(({ id, user }) => id === item._id && user === this.id);
      const serviceExistInCart_2 = array.find(({ user }) => user === this.id);
      console.log(serviceExistInCart_1);
      if (serviceExistInCart_1 !== undefined) {
        array.push({ ...item, id: item.data._id, user: item.service.user });
        this.serviceCartS.addCarts(array);
        localStorage.setItem("serviceCart", JSON.stringify(array));
      } else {
        if(serviceExistInCart_2 !== undefined){
          array.push({ ...item, id: item.data._id, user: item.service.user });
          this.serviceCartS.addCarts(array);
          localStorage.setItem("serviceCart", JSON.stringify(array));
        }else{
          localStorage.removeItem("serviceCart");
          array = [];
          array.push({ ...item, id: item.data._id, user: item.service.user });
          this.serviceCartS.addCarts(array);
          localStorage.setItem("serviceCart", JSON.stringify(array));
        }
      }
    } else {
      array.push({ ...item, id: item.data._id, user: item.service.user });
      this.serviceCartS.addCarts(array);
      localStorage.setItem("serviceCart", JSON.stringify(array));
    }
  }

}
