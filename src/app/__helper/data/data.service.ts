import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  categories: any;
  subCategories: any;
  subSubCategories: any;

  featuredProducts: any;
  dataOrders: any;
  productsList: any;

  topSliderMedia: any;
  belowSliderOffer: any;
  belowFeaturedProduct: any;
  brands: any;


  constructor() { }
}
