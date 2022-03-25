import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './__helper/auth/auth.guard';

const routes: Routes = [
  {
    path:'',
    component:DashboardComponent
  },
  {
    path:'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path:'product',
    loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
  },
  {
    path:'other',
    loadChildren: () => import('./other/other.module').then(m => m.OtherModule),
    canActivate: [AuthGuard]
  },
  {
    path:'s',
    loadChildren: () => import('./services/services.module').then(m => m.ServicesModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
