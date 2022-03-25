import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ProvidersComponent } from './providers/providers.component';
import { SpiltPipePipe } from "../__helper/pipe/spilt-pipe.pipe";
import { ProvidersDetailsComponent } from './providers-details/providers-details.component';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ProvidersCheckoutComponent } from './providers-checkout/providers-checkout.component';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import { MatChipsModule } from '@angular/material/chips';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    ProvidersComponent,
    SpiltPipePipe,
    ProvidersDetailsComponent,
    ProvidersCheckoutComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatChipsModule,
    Ng2SearchPipeModule
  ], exports: [SpiltPipePipe],
  providers: [AppComponent]
})
export class ServicesModule { }
