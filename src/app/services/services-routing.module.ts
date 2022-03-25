import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvidersCheckoutComponent } from './providers-checkout/providers-checkout.component';
import { ProvidersDetailsComponent } from './providers-details/providers-details.component';
import { ProvidersComponent } from './providers/providers.component';

const routes: Routes = [
  {
    path:'book-an-appointment',
    component:ProvidersComponent
  },
  {
    path:'salons/:id',
    component:ProvidersDetailsComponent
  },
  {
    path:'checkout',
    component:ProvidersCheckoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
