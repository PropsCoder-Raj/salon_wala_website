import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ListComponent } from './list/list.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { DetailsComponent } from './details/details.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    CartComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    NgxSliderModule,
    DragScrollModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
