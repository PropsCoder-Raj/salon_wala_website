import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { CartsService } from 'src/app/__helper/carts/carts.service';
import { UserService } from 'src/app/__helper/user/user.service';
import { environment } from 'src/environments/environment';
import { ExternalLibraryService } from './util';
import { CountryList } from "./country-list";
import { ApiService } from 'src/app/__helper/api/api.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/__helper/data/data.service';
import { Title } from '@angular/platform-browser';

declare let Razorpay: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  minimumOrderSubtotal = 0;
  maximumOrderSubtotal = 0;
  referralCodeApplyAmount = 0;

  changeAddress = false;
  newAddress = true;
  addressIndex = 0;

  name = '';
  mobile = '';
  email = '';
  response: any;
  razorpayResponse: any;
  showModal = false;
  docId = '';
  paymentId = '';
  paymentStatus = false;

  companyName = '';
  firstName = '';
  lastName = '';
  street = '';
  city = '';
  country = 'IN';
  countryName = '';
  postalCode = '';
  state = '';
  phone = '';
  countryList: any = [];
  discountId = 0;
  balance = 0;
  cutBalance = 0;
  walletAction = false;
  walletPaymentStatus = 'isNotEqual';
  finalTotalPayAmount = 0;
  totalPayAmount = 0;

  totalPay = 0;
  totalAmountPay = 100;
  RAZORPAY_OPTIONS: any = {
    key: environment.testKeyId,
    amount: '',
    name: '',
    order_id: '',
    description: 'Products',
    prefill: {
      name: '',
      email: '',
      contact: '',
      method: ''
    },
    modal: {},
    theme: {
      color: '#c7b270'
    }
  };

  addressData: any = [];
  addressNewStatus = true;

  loading = false;
  addressList: any = [];
  couponCode = '';
  couponApplyStatus = false;

  referralcodeCustomerId = '';
  referralcodeCustomerBalance = 0;
  referralcodeStatus = false;
  maxReferLimit = 0;

  constructor(private razorpayService: ExternalLibraryService, public toastr: ToastrService, public cd: ChangeDetectorRef, public appC: AppComponent, public cartS: CartsService, public userS: UserService, public authS: AuthService, public _countryList: CountryList, public apiS: ApiService, public router: Router, public dataS: DataService, public title: Title) {
    title.setTitle("Checkout - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.apiS.getSetting().subscribe(data => {
      this.referralCodeApplyAmount = data['data'].amount;
      this.maximumOrderSubtotal = data['data'].maximumOrderSubtotal;
      this.minimumOrderSubtotal = data['data'].minimumOrderSubtotal;
    });
    this.countryList = this._countryList.countryListAlpha;
    this.getAddress();
    this.razorpayService.lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js').subscribe();
    setTimeout(() => {
      this.getUserData();
      this.getCommission();
    }, 1000);
  }

  createTransaction(id: any, comment: any) {
    this.apiS.createTransctionWithReferralCode(Number(this.cartS.cutBalance), 'product', 'debit', comment, id, this.authS.currentUserValue.id).subscribe((data) => {
      if (data['status'] === 'success') {
        this.userS.updateBalance(this.authS.currentUserValue.id, this.cartS.remainingBalance).subscribe((bdata) => {
          if (bdata['status'] === 'success') {

            this.cartS.balance = this.cartS.remainingBalance;
            // this.userS.getsUserInfo();
            localStorage.removeItem("carts");
            this.cartS.carts = [];
            this.dataS.dataOrders = undefined;
            this.successToast("Order Placed");
            setTimeout(() => {
              this.loading = false;
              this.router.navigate(['/orders']);
            }, 500);
          }
        })
      } else {
        this.appC.errorStackBar("Something went wrong!");
      }
    });
  }

  getCommission() {
    this.cartS.carts.forEach((element: any) => {
      let discount = 0;
      let commission = 0;
      let commissionPercentage = 0;
      let priceCutWithCommision = 0;
      this.userS.getSigleUser(element['user']).subscribe(data => {
        commissionPercentage = data['data']['commission'];

        commission = ((element['price'] / 100) * commissionPercentage) * Number(element['num']);
        priceCutWithCommision = (element['price'] - commission) * Number(element['num']);

        console.log("Commission: " + commission);
        console.log("priceCutWithCommision: " + priceCutWithCommision);
        console.log("Proce: " + element['price']);
      });
    });
  }

  getUserData() {
    this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe(data => {
      this.firstName = data['data']['firstName'];
      this.lastName = data['data']['lastName'];
      this.mobile = data['data']['mobile'];
      this.email = data['data']['email'];
    });
  }

  applyCopon() {
    this.apiS.getCouponByCode(this.couponCode).subscribe((data) => {
      if (data['data'].length > 0) {
        if (data['data'][0]['status'] === 1) {
          this.cartS.discountPercentage = data['data'][0]['discount'];
          this.cartS.discountApply();
          this.couponApplyStatus = true;
        } else {
          this.appC.errorStackBar("Invalid Coupon Code");
        }
      } else {
        let referralCodeApply = false;
          this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe(user => {
            if (user['data']['code'] === this.couponCode) {
              this.appC.errorStackBar("You Cannot use Referral Code your self.");
              return;
            }

            if (user['data']['referralCodeApply'] === true) {
              this.appC.errorStackBar("Referral Code Expired");
              return;
            }
          });

          this.userS.getRefferalCode(this.couponCode).subscribe((data: any) => {
            if (data['count'] === 0) {
              this.appC.errorStackBar("Coupon OR Referral Code Not found.");
              return;
            } else {
              this.referralcodeCustomerId = data['data'][0]['_id'];
              this.referralcodeCustomerBalance = data['data'][0]['balance'];
              this.cartS.discountAmount = this.referralCodeApplyAmount;
              this.cartS.calculateTotal();
              this.referralcodeStatus = true;
            }
          });
      }
    });
  }

  successToast(id: any) {
    let msg = "Payment Successfully. Order Placed";
    this.appC.successStackBar(msg);
    setTimeout(() => {
      this.router.navigate(['/']).then(() => {
        location.reload();
      });
    }, 1000);
  }

  addAddress() {
    this.userS.createAddress(this.firstName + ' ' + this.lastName, this.companyName, this.street, this.city, this.country, this.postalCode, this.state, this.mobile, this.authS.currentUserValue.id).subscribe(data => {
      if (data['status'] === 'success') {
        this.razorPay();
      }
    });
  }

  addressSetUp(address: any, index: any) {
    this.addressIndex = index;
    this.addressNewStatus = false;
    this.companyName = address['companyName'];
    this.street = address['street'];
    this.city = address['city'];
    this.country = address['country'];
    this.postalCode = address['postalCode'];
    this.state = address['state'];
    this.name = address['name'];
    this.getCountryName();
  }

  getCountryName() {
    this.countryList.forEach((element: any) => {
      if (element['code'] === this.country) {
        this.countryName = element['name'].toString();
      }
    });
  }

  clearAddressSetUp() {
    this.addressNewStatus = true;
    this.companyName = '';
    this.street = '';
    this.city = '';
    this.country = 'IN';
    this.postalCode = '';
    this.state = '';
  }

  getAddress() {
    this.userS.getUserAddress(this.authS.currentUserValue.id).subscribe(data => {
      console.log(data);
      if (data['status'] === 'success') {
        if (data['data'].length > 0) {
          data['data'].forEach((element: any) => {
            this.newAddress = false;
            this.addressList.push({ data: element, status: false });
          });
          this.addressList[0]['status'] = true;
          this.addressSetUp(this.addressList[0]['data'], 0)
        }
      }
    });
  }

  payment() {
    if (this.country !== '' && this.city !== '' && this.state !== '' && this.postalCode !== '' && this.mobile !== '' && this.street !== '' && this.firstName !== '' && this.lastName !== '' && this.email !== '') {
      this.loading = true;
      if (this.addressNewStatus === true) {
        this.addAddress();
      } else {
        if (this.minimumOrderSubtotal >= this.cartS.totalPayAmount) {
          this.loading = false;
          this.appC.errorStackBar("Minimum Cart Amount Limit " + this.minimumOrderSubtotal);
          return;
        }
        if (this.maximumOrderSubtotal <= this.cartS.totalPayAmount && this.maximumOrderSubtotal !== 0) {
          this.loading = false;
          this.appC.errorStackBar("Add items worth ₹" + this.maximumOrderSubtotal + " to proceed payment");
          return;
        }
        this.razorPay();
      }
    } else {
      this.appC.errorStackBar("Please fill billing details");
    }
  }

  razorPay() {
    this.RAZORPAY_OPTIONS.amount = Math.round(this.cartS.finalTotalPayAmount) + '00';
    this.RAZORPAY_OPTIONS.prefill.name = this.name;
    this.RAZORPAY_OPTIONS.prefill.email = this.email;
    this.RAZORPAY_OPTIONS.prefill.contact = this.mobile;
    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);
    // this.showPopup();
    this.RAZORPAY_OPTIONS.modal = {
      "ondismiss": function () {
        document.getElementById("closeForm")?.click();
      }
    };
    let razorpay = new Razorpay(this.RAZORPAY_OPTIONS);
    razorpay.open();
  }

  public razorPaySuccessHandler(response: any) {
    this.razorpayResponse = `Razorpay Response`;
    this.showModal = true;
    this.cd.detectChanges();
    let interval = setInterval(() => {
      if (response.razorpay_payment_id !== '') {
        clearInterval(interval);
        // this.successToast(response.razorpay_payment_id);
        setTimeout(() => {
          this.createOrder();
        }, 1000);
      }
    });
  }

  createOrder() {
    let street = '';
    let pincode = '';
    let city = '';
    let comment = '';
    let country = '';
    let items: Array<any> = [];
    this.cartS.carts.forEach(element => {
      let discountPercentage = this.cartS.discountPercentage;
      let discountAmount = this.cartS.discountAmount;
      let commission = 0;
      let commissionPercentage = 0;
      let priceCutWithCommision = 0;
      this.userS.getSigleUser(element['user']).subscribe(data => {
        let price = element['price'] * element['num'];
        commissionPercentage = data['data']['commission'];
        commission = (price / 100) * commissionPercentage;
        priceCutWithCommision = (price - commission) - discountAmount;
        items.push({ "name": element['name'].toString(), "productId": element['_id'], "price": element['price'], "quantity": element['num'], "discountAmount": discountAmount, "discountPercentage": discountPercentage, "commissionAmount": commission, "commissionPercentage": commissionPercentage, "priceCutWithCommision": priceCutWithCommision, "vendorId": element['user'], taxes: element['taxesArr'] });
        comment = comment + element['name'] + ' x ' + this.cartS.getCount(element) + ', ';
      });
    });
    this.addressList.forEach((element: any) => {
      if (element['status'] === true) {
        street = element['data']['street'];
        pincode = element['data']['postalCode'];
        city = element['data']['city'];
        country = element['data']['country'];
      }
    });
    let arr = {
      "name": this.firstName.toString() + ' ' + this.lastName.toString(),
      "street": street.toString(),
      "city": city.toString(),
      "countryCode": country.toString(),
      "postalCode": pincode.toString(),
      "phone": this.mobile.toString()
    }

    let interval = setInterval(() => {
      if (items.length === this.cartS.carts.length) {
        clearInterval(interval);
        this.userS.createUserOrder("PAID", "AWAITING_PROCESSING", this.couponCode, this.cartS.discountAmount, this.cartS.discountPercentage, comment, this.cartS.totalPayAmount, arr, arr, items, this.authS.currentUserValue.id).subscribe((data) => {
          if (data['status'] === 'success') {

            if (this.referralcodeStatus === true) {
              this.userS.updateReferralCode(this.authS.currentUserValue.id).subscribe(users => { });
              this.apiS.createTransctionWithReferralCode(this.referralCodeApplyAmount, 'referral', 'credit', this.couponCode + ' Referral Code Apply ', data['orderData']['_id'], this.referralcodeCustomerId).subscribe((data) => {
                let balance = Number(this.referralcodeCustomerBalance) + this.referralCodeApplyAmount;
                this.userS.updateBalance(this.referralcodeCustomerId, balance).subscribe((bdata) => {
                  if (bdata['status'] === 'success') {
                  }
                });
              });
            }

            if (this.cartS.walletAction !== false) {
              this.createTransaction(data['orderData']['_id'], 'Paid for order ' + data['orderData']['orderId']);
            }

            setTimeout(() => {
              let transactionCount = 0;
              items.forEach((element: any) => {
                this.apiS.createTransction(element['priceCutWithCommision'], 'Product', 'deposite', 'Order Payemnt', data['orderData']['_id'], element['productId'], element['vendorId']).subscribe((dataTrans => {
                  if (dataTrans['status'] === 'success') {
                    this.apiS.updateWallet(element['priceCutWithCommision'], element['vendorId']).subscribe(dataWallet => {
                      if (dataWallet['status'] === 'success') {
                        transactionCount++;
                      }
                    })
                  }
                }));
              });

              let intervalTrans = setInterval(() => {
                if (transactionCount === items.length) {
                  clearInterval(intervalTrans);
                  localStorage.removeItem("carts");
                  this.cartS.carts = [];
                  this.dataS.dataOrders = undefined;
                  this.appC.successStackBar("Order Palced");
                  setTimeout(() => {
                    this.loading = false;
                    this.router.navigate(['/other/orders']).then(() => {
                      location.reload();
                    });
                  }, 500);
                }
              });
            }, 1000);
          }
        });
      }
    }, 1000);
  }

  showLogin() {
    $('#checkout-login').slideToggle();
  }
  showCoupon() {
    $('#checkout_coupon').slideToggle();
  }
  showCreateAcc() {
    $('#cbox_info').slideToggle();
  }
  showDeliveryAddress() {
    $('#ship-box-info').slideToggle();
  }
}
