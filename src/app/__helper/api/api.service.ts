import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators'
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public _headers: any;

  constructor(public http: HttpClient,public authS: AuthService) {
    this._headers = { 'Content-Type': 'application/json' };
  }

  // Get Setting
  getSetting() {
    return this.http.get<any>(`${environment.baseURL}/settings`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Wallet
  updateWallet(amount: any, id: any) {
    const data = JSON.stringify({
      "amount": amount,
    });
    return this.http.put<any>(`${environment.baseURL}/vendor/wallet/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  /*********************************   TransactionsBookings   ***********************************/

  createTransctionWithBooking(amount: any, type: any, transactionType: any, message: any, bookingId: any, serviceId: any, userId: any) {
    const data = JSON.stringify({
      "amount": amount,
      "type": type,
      "transactionType": transactionType,
      "message": message,
      "bookingId": bookingId,
      "serviceId": serviceId,
    });
    return this.http.post<any>(`${environment.baseURL}/transaction/booking/` + userId, data, { headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  /*********************************   Transactions   ***********************************/

  createTransctionWithReferralCode(amount: any, type: any, transactionType: any, message: any, orderId: any, userId: any) {
    const data = JSON.stringify({
      "amount": amount,
      "type": type,
      "transactionType": transactionType,
      "message": message,
      "orderId": orderId,
    });
    return this.http.post<any>(`${environment.baseURL}/transaction/referral/` + userId, data, { headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  /*********************************   Contacts   ***********************************/

  createContact(name: any, email: any, subject: any, message: any) {
    const data = JSON.stringify({
      "name": name,
      "email": email,
      "subject": subject,
      "message": message
    });
    return this.http.post<any>(`${environment.baseURL}/contacts`, data, { headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  /*********************************   Transactions   ***********************************/

  createTransction(amount: any, type: any, transactionType: any, message: any, orderId: any, productId: any, userId: any) {
    const data = JSON.stringify({
      "amount": amount,
      "type": type,
      "transactionType": transactionType,
      "message": message,
      "orderId": orderId,
      "productId": productId,
    });
    return this.http.post<any>(`${environment.baseURL}/transaction/` + userId, data, { headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  
  // Get Single Category
  getTransaction(id: any) {
    return this.http.get<any>(`${environment.baseURL}/transaction/vendor/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  /*********************************   Ratings   ***********************************/

  // Create Ratings
  createRatings(id: any, rating: any, productId: any, review: any) {
    const data = JSON.stringify({
      "rating": rating,
      "productId": productId,
      "review": review
    });
    return this.http.post<any>(`${environment.baseURL}/ratings/`+ id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Ratings
  updateRatings(id: any, rating: any, review: any) {
    const data = JSON.stringify({
      "rating": rating,
      "review": review
    });
    return this.http.put<any>(`${environment.baseURL}/ratings/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Ratings Product Wise
  getRatingsProductsWise(productId: any) {
    return this.http.get<any>(`${environment.baseURL}/ratings/product/`+ productId)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Ratings Order Id
  getRatingsOrderId(orderId: any) {
    return this.http.get<any>(`${environment.baseURL}/ratings/order/`+ orderId)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Ratings
  getSingleRatings(id: any) {
    return this.http.get<any>(`${environment.baseURL}/ratings/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  /*********************************   File Handling   ***********************************/

  uploadFile(filedata:any) {
    return this.http.post<any>(`${environment.baseURL}/upload/`, filedata)
    .pipe(map(data => {
      return data;
    }));
  }

  downloadFile(filename:any) {
    return this.http.get<any>(`${environment.baseURL}/retrieve/`+filename).subscribe(data=>{
      console.log(data);
    });
  }


  /*********************************   Category   ***********************************/

  // Create Category
  createCategory(category_name: any, thumbnail: any) {
    const data = JSON.stringify({
      "category_name": category_name,
      "thumbnail": thumbnail
    });
    return this.http.post<any>(`${environment.baseURL}/category`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Category
  updateCategory(category_name: any, thumbnail: any, id: any) {
    const data = JSON.stringify({
      "category_name": category_name,
      "thumbnail": thumbnail
    });
    return this.http.put<any>(`${environment.baseURL}/category/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get All Categories
  getAllCategories() {
    return this.http.get<any>(`${environment.baseURL}/categories`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Category
  getSingleCategory(id: any) {
    return this.http.get<any>(`${environment.baseURL}/category/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Delete Category
  deleteCategory(id: any) {
    return this.http.delete<any>(`${environment.baseURL}/category/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

/*********************************   Sub-Category   ***********************************/

  // Create Category
  createSubCategory(category_name: any, category_id: any) {
    const data = JSON.stringify({
      "sub_category_name": category_name,
      "categoryId": category_id
    });
    return this.http.post<any>(`${environment.baseURL}/sub-category`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Category
  updateSubCategory(category_name: any, id: any) {
    const data = JSON.stringify({
      "sub_category_name": category_name
    });
    return this.http.put<any>(`${environment.baseURL}/sub-category/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get All Categories
  getAllSubCategories() {
    return this.http.get<any>(`${environment.baseURL}/sub-categories`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Category
  getSingleSubCategory(id: any) {
    return this.http.get<any>(`${environment.baseURL}/sub-category/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Category By CategoryId
  getSubCategoryByCategoryId(id: any) {
    return this.http.get<any>(`${environment.baseURL}/sub-category/category/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Delete Category
  deleteSubCategory(id: any) {
    return this.http.delete<any>(`${environment.baseURL}/sub-category/` + id)
      .pipe(map(data => {
        return data;
      }));
  }


/*********************************  Sub Sub-Category   ***********************************/

  // Create Category
  createSubSubCategory(category_name: any, category_id: any) {
    const data = JSON.stringify({
      "sub_sub_category_name": category_name,
      "subcategoryId": category_id
    });
    return this.http.post<any>(`${environment.baseURL}/sub-sub-category`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Category
  updateSubSubCategory(category_name: any, id: any) {
    const data = JSON.stringify({
      "sub_sub_category_name": category_name
    });
    return this.http.put<any>(`${environment.baseURL}/sub-sub-category/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get All Categories
  getAllSubSubCategories() {
    return this.http.get<any>(`${environment.baseURL}/sub-sub-categories`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Category
  getSingleSubSubCategory(id: any) {
    return this.http.get<any>(`${environment.baseURL}/sub-sub-category/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Category By CategoryId
  getSubSubCategoryByCategoryId(id: any) {
    return this.http.get<any>(`${environment.baseURL}/sub-sub-category/sub-category/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Delete Category
  deleteSubSubCategory(id: any) {
    return this.http.delete<any>(`${environment.baseURL}/sub-sub-category/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

   // Delete Category By category Id
   deleteSubSubCategoryByCategoryId(id: any) {
    return this.http.delete<any>(`${environment.baseURL}/sub-sub-category/category/` + id)
      .pipe(map(data => {
        return data;
      }));
  }



  /*********************************   Services   ***********************************/

  // Create Service
  createService(serviceName: any, thumbnail: any) {
    const data = JSON.stringify({
      "serviceName": serviceName,
      "thumbnail": thumbnail
    });
    return this.http.post<any>(`${environment.baseURL}/service`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Service
  updateService(serviceName: any, thumbnail: any, id: any) {
    const data = JSON.stringify({
      "serviceName": serviceName,
      "thumbnail": thumbnail
    });
    return this.http.put<any>(`${environment.baseURL}/service/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get All Services
  getAllServices() {
    return this.http.get<any>(`${environment.baseURL}/services`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Service
  getSingleService(id: any) {
    return this.http.get<any>(`${environment.baseURL}/service/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Delete Service
  deleteService(id: any) {
    return this.http.delete<any>(`${environment.baseURL}/service/` + id)
      .pipe(map(data => {
        return data;
      }));
  }





  /*********************************   Banners   ***********************************/


  // Get All Banner
  getAllBanner() {
    return this.http.get<any>(`${environment.baseURL}/banner`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Banner
  getSingleBanner(id: any) {
    return this.http.get<any>(`${environment.baseURL}/banner/` + id)
      .pipe(map(data => {
        return data;
      }));
  }





  /*********************************   Products   ***********************************/

  // Create Product
  createProduct(name: any,description:any,tags:any,model:any, sku: any, price: any, isShippingRequired: any,featured: any,categoryArr: any,Length: any, Width: any, Height: any, weight: any,  status: any, mediaArr: any) {
    const data = JSON.stringify({
      "name": name,
      "description":description,
      "tags":tags,
      "model":model,
      "sku": sku,
      "price": price,
      "isShippingRequired": isShippingRequired,
      "featured": featured,
      "category": categoryArr,
      "Length": Length,
      "Width": Width,
      "Height": Height,
      "weight": weight,
      "status": status,
      "media": mediaArr
    });
    return this.http.post<any>(`${environment.baseURL}/product`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Product
  updateProduct(name: any,description:any,tags:any,model:any, sku: any, price: any, isShippingRequired: any,featured: any,categoryArr: any,Length: any, Width: any, Height: any, weight: any,  status: any, mediaArr: any, id: any) {
    const data = JSON.stringify({
      "name": name,
      "description":description,
      "tags":tags,
      "model":model,
      "sku": sku,
      "price": price,
      "isShippingRequired": isShippingRequired,
      "featured": featured,
      "category": categoryArr,
      "Length": Length,
      "Width": Width,
      "Height": Height,
      "weight": weight,
      "status": status,
      "media": mediaArr
    });
    return this.http.put<any>(`${environment.baseURL}/product/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get All Product
  getAllProduct() {
    return this.http.get<any>(`${environment.baseURL}/product`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Product
  getSingleProduct(id: any) {
    return this.http.get<any>(`${environment.baseURL}/product/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Product
  getSingleProductName(name: any) {
    return this.http.get<any>(`${environment.baseURL}/product/name/` + name)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Category-Wise Product
  getCategoryWiseProduct(id: any) {
    return this.http.get<any>(`${environment.baseURL}/product-category/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get SubCategory Product
  getSubtSubCategoryWiseProduct(id: any) {
    return this.http.get<any>(`${environment.baseURL}/product/subcategory/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Product Featured
  getProductFeatured() {
    return this.http.get<any>(`${environment.baseURL}/product-featured`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Delete Product
  deleteProduct(id: any) {
    return this.http.delete<any>(`${environment.baseURL}/product/` + id)
      .pipe(map(data => {
        return data;
      }));
  }








  /*********************************  Services Products   ***********************************/

  // Create Service Product
  createServiceProduct(name: any,description:any,tags:any,model:any, sku: any, price: any, isShippingRequired: any,featured: any,categoryArr: any,Length: any, Width: any, Height: any, weight: any,  status: any, mediaArr: any) {
    const data = JSON.stringify({
      "name": name,
      "description":description,
      "tags":tags,
      "model":model,
      "sku": sku,
      "price": price,
      "isShippingRequired": isShippingRequired,
      "featured": featured,
      "category": categoryArr,
      "Length": Length,
      "Width": Width,
      "Height": Height,
      "weight": weight,
      "status": status,
      "media": mediaArr
    });
    return this.http.post<any>(`${environment.baseURL}/service/product/create`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Service Product
  updateServiceProduct(name: any,description:any,tags:any,model:any, sku: any, price: any, isShippingRequired: any,featured: any,categoryArr: any,Length: any, Width: any, Height: any, weight: any,  status: any, mediaArr: any, id: any) {
    const data = JSON.stringify({
      "name": name,
      "description":description,
      "tags":tags,
      "model":model,
      "sku": sku,
      "price": price,
      "isShippingRequired": isShippingRequired,
      "featured": featured,
      "category": categoryArr,
      "Length": Length,
      "Width": Width,
      "Height": Height,
      "weight": weight,
      "status": status,
      "media": mediaArr
    });
    return this.http.put<any>(`${environment.baseURL}/service/product/update/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get All Service Product
  getAllServiceProduct() {
    return this.http.get<any>(`${environment.baseURL}/service/product/all`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Service Product
  getSingleServiceProduct(id: any) {
    return this.http.get<any>(`${environment.baseURL}/service/product/single/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Category-Wise Service Product
  getCategoryWiseServiceProduct(id: any) {
    return this.http.get<any>(`${environment.baseURL}/service/product-category/category/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Service Product Featured
  getServiceProductFeatured() {
    return this.http.get<any>(`${environment.baseURL}/service/product-featured/featured`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Delete Service Product
  deleteServiceProduct(id: any) {
    return this.http.delete<any>(`${environment.baseURL}/service/product/delete/` + id)
      .pipe(map(data => {
        return data;
      }));
  }





  /*********************************   Tax   ***********************************/

  // Create Tax
  createTax(name: any, percentage: any) {
    const data = JSON.stringify({
      "name": name,
      "percentage": percentage
    });
    return this.http.post<any>(`${environment.baseURL}/tax`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Tax
  updateTax(name: any, percentage: any, id: any) {
    const data = JSON.stringify({
      "name": name,
      "percentage": percentage
    });
    return this.http.put<any>(`${environment.baseURL}/tax/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get All Tax
  getAllTax() {
    return this.http.get<any>(`${environment.baseURL}/tax`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Tax
  getSingleTax(id: any) {
    return this.http.get<any>(`${environment.baseURL}/tax/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Delete Tax
  deleteTax(id: any) {
    return this.http.delete<any>(`${environment.baseURL}/tax/` + id)
      .pipe(map(data => {
        return data;
      }));
  }






  /*********************************   Coupons   ***********************************/

  // Create Coupon
  createCoupon(name: any, code: any, status: any, discount: any, amountLimit: any) {
    const data = JSON.stringify({
      "name": name,
      "code": code,
      "status": status,
      "discount": discount,
      "amountLimit": amountLimit
    });
    return this.http.post<any>(`${environment.baseURL}/coupon`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Coupon
  updateCoupon(name: any, code: any, status: any, discount: any, amountLimit: any, id: any) {
    const data = JSON.stringify({
      "name": name,
      "code": code,
      "status": status,
      "discount": discount,
      "amountLimit": amountLimit
    });
    return this.http.put<any>(`${environment.baseURL}/coupon/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Coupon Status
  updateCouponStatus(status: any, id: any) {
    const data = JSON.stringify({
      "status": status
    });
    return this.http.put<any>(`${environment.baseURL}/coupon/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get All Coupon
  getAllCoupon() {
    return this.http.get<any>(`${environment.baseURL}/coupon`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Coupon
  getSingleCoupon(id: any) {
    return this.http.get<any>(`${environment.baseURL}/coupon/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Coupon By Code
  getCouponByCode(id: any) {
    return this.http.get<any>(`${environment.baseURL}/coupon-by-code/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Delete Coupon
  deleteCoupon(id: any) {
    return this.http.delete<any>(`${environment.baseURL}/coupon/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // getAllUsers
  getAllUsers() {
    return this.http.get<any>(`${environment.baseURL}/user/all`, )
    .pipe(map(data => {
      return data;
    }));
  }

  //getAllVendors
  getAllVendors() {
    return this.http.get<any>(`${environment.baseURL}/vendor/all`, )
    .pipe(map(data => {
      return data;
    }));
  }

  //getAllServiceVendors
  getAllServiceVendors() {
    return this.http.get<any>(`${environment.baseURL}/service/vendor/all`, )
    .pipe(map(data => {
      return data;
    }));
  }
  // Get Single User
  getSingleUser(id: any) {
    return this.http.get<any>(`${environment.baseURL}/user/` + id)
      .pipe(map(data => {
        return data;
      }));
  }


  // Create Vendor

  createVendor(data:any){
    
    return this.http.post<any>(`${environment.baseURL}/vendor/create`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  createServiceVendor(data:any){
    
    return this.http.post<any>(`${environment.baseURL}/service/vendor/create`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  getServiceVendor(id:any){ 
    return this.http.get<any>(`${environment.baseURL}/service/vendor/`+ id)
      .pipe(map(data => {
        return data;
      }));
  }


  getProvidersByCity(city:any){
    return this.http.get<any>(`${environment.baseURL}/service/vendor-by-city/`+city)
      .pipe(map(data => {
        return data;
    }));
  }

  getVendorServiceProducts(id: any){
    return this.http.get<any>(`${environment.baseURL}/vendor-service/product/user/`+id)
      .pipe(map(data => {
        return data;
    }));
  }
}

