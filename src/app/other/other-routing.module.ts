import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ChangePassowrdComponent } from './change-passowrd/change-passowrd.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { OrdersComponent } from './orders/orders.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProfileComponent } from './profile/profile.component';
import { ReferralComponent } from './referral/referral.component';
import { RefundPolicyComponent } from './refund-policy/refund-policy.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { WalletComponent } from './wallet/wallet.component';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  {
    path:'wishlist',
    component:WishlistComponent
  },
  {
    path:'contact',
    component:ContactUsComponent
  },
  {
    path:'about',
    component:AboutUsComponent
  },
  {
    path:'terms-condition',
    component:TermsConditionComponent
  },
  {
    path:'refund-policy',
    component:RefundPolicyComponent
  },
  {
    path:'privacy-policy',
    component:PrivacyPolicyComponent
  },
  {
    path:'orders',
    component:OrdersComponent
  },
  {
    path:'bookings',
    component:BookingsComponent
  },
  {
    path:'profile',
    component:ProfileComponent
  },
  {
    path:'change-password',
    component:ChangePassowrdComponent
  },
  {
    path:'refer-earn',
    component:ReferralComponent
  },
  {
    path:'wallet',
    component:WalletComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherRoutingModule { }
