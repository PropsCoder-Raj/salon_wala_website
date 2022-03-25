import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/__helper/api/api.service';
import { ServiceCartsService } from 'src/app/__helper/service-carts/service-carts.service';



@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {

  currentCity = "Pune"
  providers: Array<any> = [];
  searchterm = '';
  constructor(private apiService: ApiService, public router: Router, public serviceCartS: ServiceCartsService, public title: Title) {
    title.setTitle("Services List - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.apiService.getProvidersByCity(this.currentCity).subscribe(data=>{
      console.log(data);
      // this.providers = data.data;
      data.data.forEach((elementData: any) => {
        let _array: Array<any> = [];
        let newPromise = new Promise((resolve: any, reject: any) => {
          this.apiService.getVendorServiceProducts(elementData['_id']).subscribe(data => {
            data['data'].forEach((element: any, index: any, array: any) => {
              this.apiService.getSingleServiceProduct(element['serviceProduct'][0]).subscribe(serviceData => {
                _array.push({ data: serviceData['data'][0], service: element});

                if(index === array.length - 1) resolve();
              })
            });
          })
        });
        
        newPromise.then(() => {
          this.providers.push({data: elementData, services: _array});
          console.log(this.providers);
        });
      });
    });
  }

  providersDetails(id: any){
    this.router.navigate(['/s/salons/'+ id]);
  }

}
