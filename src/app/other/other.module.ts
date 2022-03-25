import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherRoutingModule } from './other-routing.module';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { ChangePassowrdComponent } from './change-passowrd/change-passowrd.component';
import { BookingsComponent } from './bookings/bookings.component';

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './refund-policy/refund-policy.component';
import { ReferralComponent } from './referral/referral.component';
import { WalletComponent } from './wallet/wallet.component';

@NgModule({
  declarations: [
    WishlistComponent,
    ContactUsComponent,
    AboutUsComponent,
    OrdersComponent,
    ProfileComponent,
    ChangePassowrdComponent,
    BookingsComponent,
    TermsConditionComponent,
    PrivacyPolicyComponent,
    RefundPolicyComponent,
    ReferralComponent,
    WalletComponent
  ],
  imports: [
    CommonModule,
    OtherRoutingModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class OtherModule { }
