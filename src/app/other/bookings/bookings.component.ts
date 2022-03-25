import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

  bookingsList: Array<any> = [];
  bookingsCount = 0;
  name = '';
  baseURL = environment.baseURL;

  constructor(public userS: UserService, public authS: AuthService, public title: Title) {
    title.setTitle("Bookings - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.userS.getUserBookings(this.authS.currentUserValue.id).subscribe(data=>{
      if(data['data'].length > 0){
        console.log(data['data']);
        data['data'].forEach((element: any) => {
          this.userS.getSigleUser(element['services'][0]['_shopUser']).subscribe(user => {
            this.bookingsList.push({data: element, user: user['data']});    
          });
        });
        this.bookingsCount++;
      }
    })
  }

}
