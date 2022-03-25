import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public _headers: any

  constructor(public http: HttpClient, public authS: AuthService) {
    this._headers = { 'Content-Type': 'application/json' };
  }


  get(): Observable<any> {
    return this.http.get(`${environment.baseURL}/user/all`,);
  }

  // Create User Bookings
  createUserBookings(paymentStatus: any, couponCode: any, discountAmount: any, bookingTotal: any, subTotal: any, services: any, slot: any, bookingDate: any) {
    let orderId = this.makeid(8).toString();
    const data = JSON.stringify({
      "paymentStatus": paymentStatus,
      "couponCode": couponCode,
      "discountAmount": discountAmount,
      "bookingTotal": bookingTotal,
      "subTotal": subTotal,
      "services": services,
      "slot": slot,
      "bookingDate": bookingDate,
      "id": this.authS.currentUserValue.id,
    });
    return this.http.post<any>(`${environment.baseURL}/bookings`, data, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  // Get User Bookings
  getAllBookings() {
    return this.http.get<any>(`${environment.baseURL}/bookings-all`, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  // Get User Bookings
  getUserBookings(customerId: any) {
    return this.http.get<any>(`${environment.baseURL}/bookings/`+ customerId, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  // Create User Orders
  createUserOrder(paymentStatus: any, fulfillmentStatus: any, couponCode: any, discountAmount: any, discountPercentage: any, orderComments: any, total: any, additionalInfo: any, shippingPerson: any, items: any, id: any) {
    let orderId = this.makeid(8).toString();
    const data = JSON.stringify({
      "paymentStatus": paymentStatus,
      "fulfillmentStatus": fulfillmentStatus,
      "couponCode": couponCode,
      "discountAmount": discountAmount,
      "discountPercentage": discountPercentage,
      "orderComments": orderComments,
      "total": total,
      "additionalInfo": additionalInfo,
      "shippingPerson": shippingPerson,
      "items": items,
      "id": id,
      "orderId": orderId
    });
    return this.http.post<any>(`${environment.baseURL}/order`, data, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  // Get User Orders
  getUserOrder(customerId: any) {
    return this.http.get<any>(`${environment.baseURL}/order/`+ customerId, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  makeid(length: any) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  // Create Address
  createAddress(name: any,companyName:any,street:any,city:any, country: any, postalCode: any, state: any,phone: any,user: any) {
    const data = JSON.stringify({
      "name": name,
      "companyName": companyName,
      "street": street,
      "city": city,
      "country": country,
      "postalCode": postalCode,
      "state": state,
      "phone": phone,
      "user": user,
    });
    return this.http.post<any>(`${environment.baseURL}/user/address`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // getSingleAddress
  getUserAddress(id : any) {
    return this.http.get<any>(`${environment.baseURL}/user/address/`+ id, )
    .pipe(map(data => {
      return data;
    }));
  }

  
  
  // updateUser
  updateUser(id: any, firstName: any, lastName: any, email: any, mobile: any, dob: any, salutation: any) {
    const data = JSON.stringify({
      "salutation": salutation,
      "firstName": firstName,
      "lastName": lastName,
      "email": email,
      "mobile": mobile,
      "dob": dob,
    });
    return this.http.put<any>(`${environment.baseURL}/user/update/`+ id, data, { headers: this._headers })
    .pipe(map(data => {
      return data;
    }));
  }
  
  // getSigleUser
  getSigleUser(id : any) {
    return this.http.get<any>(`${environment.baseURL}/user/`+ id, )
    .pipe(map(data => {
      return data;
    }));
  }

  // Get Finf By Email
  getFindbyEmail(email: any) {
    return this.http.get<any>(`${environment.baseURL}/user/email/` + email, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  // Get Refferal Code
  getRefferalCode(code: any) {
    return this.http.get<any>(`${environment.baseURL}/user/refferal/` + code, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  updateReferralCode(id: any) {
    const data = JSON.stringify({
      "referralCodeApply": true
    });
    return this.http.put<any>(`${environment.baseURL}/user/referral-update/`+ id, data, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  updateBalance(id: any, balance: any) {
    const data = JSON.stringify({
      "balance": balance,
    });
    return this.http.put<any>(`${environment.baseURL}/balance/`+ id, data, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }
  
  // changePassword
  changePassword(id : any, password : any) {
    const data = JSON.stringify({
      "password": password
    });
    return this.http.put<any>(`${environment.baseURL}/user/change-password/` + id, data, { headers: this._headers })
    .pipe(map(data => {
      return data;
    }));
  }

  // updateWishList
  updateWishlist(id: any, wishlistArr: any) {
    const data = JSON.stringify({
      "wishlist": wishlistArr
    });
    return this.http.put<any>(`${environment.baseURL}/user/wishlist/`+ id, data, { headers: this._headers })
    .pipe(map(data => {
      return data;
    }));
  }

  // getWishList
  getWishlist(id: any) {
    return this.http.get<any>(`${environment.baseURL}/user/wishlist/`+ id)
    .pipe(map(data => {
      return data;
    }));
  }
  
  // getCart
  getCart(id: any) {
    return this.http.get<any>(`${environment.baseURL}/user/cart/`+ id)
    .pipe(map(data => {
      return data;
    }));
  }
  
  // updateCart
  updateCart(id: any, cartArr: any) {
    const data = JSON.stringify({
      "cart": cartArr
    });
    return this.http.put<any>(`${environment.baseURL}/user/cart/`+ id, data)
    .pipe(map(data => {
      return data;
    }));
  }
}
