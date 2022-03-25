import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from './__helper/api/api.service';
import { AuthService } from './__helper/auth/auth.service';
import { CartsService } from './__helper/carts/carts.service';
import { DataService } from './__helper/data/data.service';
import { UserService } from './__helper/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'saloonwala';
  categories: Array<any> = [];
  subCategories: Array<any> = [];
  subSubCategories: Array<any> = [];
  featuredProducts: Array<any> = [];

  msg = '';
  isLogin = false;
  cartsCount = 0;
  baseURL = environment.baseURL;
  serviceCarts: Array<any> = [];
  provider = '';

  constructor(public apiS: ApiService, public dataS: DataService, public router: Router, public authS: AuthService, public cartS: CartsService, public userS: UserService){
    if(localStorage.getItem('currentUser') !== null && localStorage.getItem('currentUser') !== '' && localStorage.getItem('currentUser') !== undefined){
      this.isLogin = true;
      this.getUser();
    }else{
      this.isLogin = false;
    }
  }

  getUser(){
    this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe(data=>{
      this.provider = data['data']['provider'];
    });
  }

  ngOnInit(): void {
    let data: any = localStorage.getItem("serviceCart");
    this.serviceCarts = JSON.parse(data);
    this.cartsCount
    if(this.dataS.categories !== undefined && this.dataS.subCategories !== undefined && this.dataS.subSubCategories !== undefined){
      this.categories = this.dataS.categories;
      this.subCategories = this.dataS.subCategories;
      this.subSubCategories = this.dataS.subSubCategories;
    }else{
      this.getData();
    }
  }

  getData(){
    this.apiS.getAllCategories().subscribe(data => {
      this.categories = data['data'];
      this.dataS.categories = this.categories;
    });  
    this.apiS.getAllSubCategories().subscribe(data => {
      this.subCategories = data['data'];
      this.dataS.subCategories = this.subCategories;
    });  
    this.apiS.getAllSubSubCategories().subscribe(data => {
      this.subSubCategories = data['data'];
      this.dataS.subSubCategories = this.subSubCategories;
    });
  }

  logout(){
    if(this.provider === 'Email'){
      this.authS.logout();
    }else if(this.provider === 'Google' || this.provider === 'Facebook'){
      this.authS.logout();
    }
  }

  products(name: any, id: any){
    let nm = encodeURIComponent(name).replace(/%20/g,"-").replace(/%28/g,"-").replace(/%29/g,"-");
    this.dataS.productsList = undefined;
    setTimeout(() => {
      this.router.navigate(['/product/' + nm + '/' + id]);
    }, 500);
  }

  successStackBar(msg: any) {
    var x : any = document.getElementById("snackbarSuccess");
    x.innerHTML = msg;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  errorStackBar(msg: any) {
    var x : any = document.getElementById("snackbarError");
    x.innerHTML = msg;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
}
