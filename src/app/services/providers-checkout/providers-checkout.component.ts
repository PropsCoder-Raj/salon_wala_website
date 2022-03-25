import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/__helper/api/api.service';
import { ServiceCartsService } from 'src/app/__helper/service-carts/service-carts.service';
import { UserService } from 'src/app/__helper/user/user.service';
import { environment } from 'src/environments/environment';
import { formatDate } from "@angular/common";
import { Title } from '@angular/platform-browser';
declare var Razorpay: any;

@Component({
  selector: 'app-providers-checkout',
  templateUrl: './providers-checkout.component.html',
  styleUrls: ['./providers-checkout.component.scss']
})
export class ProvidersCheckoutComponent implements OnInit {

  couponCode = '';
  bookingDate: any;
  loading = false;

  today = new Date();
  secondDay: any;
  thirdDay: any;

  todayOpen = '';
  todayClosed = '';
  secondDayOpen = '';
  secondDayClosed = '';
  thirdDayOpen = '';
  thirdDayClosed = '';

  _today = '';
  _secondDay = '';
  _thirdDay = '';
  _days = [
    { id: 1, name: "sunday" },
    { id: 2, name: "monday" },
    { id: 3, name: "tuesday" },
    { id: 4, name: "wednesday" },
    { id: 5, name: "thursday" },
    { id: 6, name: "friday" },
    { id: 7, name: "saturday" },
  ];

  _todayArray: Array<any> = [];
  _secondDayArray: Array<any> = [];
  _thirdDayArray: Array<any> = [];

  _todayList: Array<any> = [];
  _secondDayList: Array<any> = [];
  _thirdDayList: Array<any> = [];

  _todaySlots: Array<any> = [];
  _secondDaySlots: Array<any> = [];
  _thirdDaySlots: Array<any> = [];

  usualTime: Array<any> = [];
  shopname = '';

  name = '';
  email = '';
  mobile = '';
  razorpayResponse = '';
  showModal = false;

  day = '';
  selectedSlotsId = '';
  selectedSlotArray: Array<any> = [];
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

  currenttime: any;

  bookings: Array<any> = [];


  constructor(public serviceCarts: ServiceCartsService, public apiS: ApiService, public appC: AppComponent, public cd: ChangeDetectorRef, public userS: UserService, public router: Router, public title: Title) {
    title.setTitle("Checkout - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.applyValues();
    this.getcurrenttimehour();
    this.getAllBooking();
    
  }

  applyValues(){
    var _secondDay = new Date();
    _secondDay.setDate(_secondDay.getDate() + 1);
    this.secondDay = _secondDay;
    var _thirdDay = new Date();
    _thirdDay.setDate(_thirdDay.getDate() + 2);
    this.thirdDay = _thirdDay;

    this._today = this._days[this.today.getDay()]['name'];
    this._secondDay = this._days[this.secondDay.getDay()]['name'];
    this._thirdDay = this._days[this.thirdDay.getDay()]['name'];

    this.apiS.getSingleUser(this.serviceCarts.carts[0]['service']['user']).subscribe(data => {
      this.usualTime = data['data']['timings'];
      this.shopname = data['data']['shopName'];
      console.log(this.usualTime[0][this._secondDay]);
      this._todayArray.push(this.usualTime[0][this._today]);
      this.todayOpen = this._todayArray[0]['open'];
      this.todayClosed = this._todayArray[0]['close'];
      this._secondDayArray.push(this.usualTime[0][this._secondDay]);
      this.secondDayOpen = this._secondDayArray[0]['open'];
      this.secondDayClosed = this._secondDayArray[0]['close'];
      this._thirdDayArray.push(this.usualTime[0][this._thirdDay]);
      this.thirdDayOpen = this._thirdDayArray[0]['open'];
      this.thirdDayClosed = this._thirdDayArray[0]['close'];

      this.getAllMin(this.todayOpen, this.todayClosed, 'today');
      this.getAllMin(this.secondDayOpen, this.secondDayClosed, 'secondDay');
      this.getAllMin(this.thirdDayOpen, this.thirdDayClosed, 'thirdDay');
    })
  }

  getAllBooking() {
    this.userS.getAllBookings().subscribe((data) => {
      console.log(data['data']);
      data['data'].forEach((element: any) => {
        let bookingDate = formatDate(element['bookingDate'], "ddMMyyyy", 'en-US');
        let start = element['slot']['start'].replace(":", "");
        let end = element['slot']['end'].replace(":", "");

        this.bookings.push({ bookingDate: Number(bookingDate), start: Number(start), end: Number(end) });
        console.log(this.bookings)
      });
    });
  }

  getAllMin(start: string, end: string, name: string) {

    if (start !== '' && end !== '') {

      let splitS = start.split(":");
      let splitE = end.split(":");

      let array = [];
      for (let i = Number(splitS[0]); i <= Number(splitE[0]); i++) {
        if (i === Number(splitE[0])) {
          for (let j = 0; j <= Number(splitE[1]); j++) {
            let hour = '';
            let min = '';

            if (i < 10) {
              hour = '0' + i;
            } else {
              hour = i.toString();
            }

            if (j < 10) {
              min = '0' + j;
            } else {
              min = j.toString();
            }

            let time = [hour, min].join(':');
            array.push({ time: time });
          }
        } else if (i === Number(splitS[0])) {
          for (let j = Number(splitS[1]); j <= 59; j++) {
            let hour = '';
            let min = '';

            if (i < 10) {
              hour = '0' + i;
            } else {
              hour = i.toString();
            }

            if (j < 10) {
              min = '0' + j;
            } else {
              min = j.toString();
            }

            let time = [hour, min].join(':');
            array.push({ time: time });
          }
        } else {
          for (let j = 0; j <= 59; j++) {
            let hour = '';
            let min = '';

            if (i < 10) {
              hour = '0' + i;
            } else {
              hour = i.toString();
            }

            if (j < 10) {
              min = '0' + j;
            } else {
              min = j.toString();
            }

            let time = [hour, min].join(':');
            array.push({ time: time });
          }
        }
      }

      if (name == 'today') {
        this._todayList = array;
        setTimeout(() => {
          this.getSlots(this._todayList, 'today');
        }, 1000);
      } else if (name == 'secondDay') {
        this._secondDayList = array;
        setTimeout(() => {
          this.getSlots(this._secondDayList, 'secondDay');
        }, 1000);
      } else if (name == 'thirdDay') {
        this._thirdDayList = array;
        setTimeout(() => {
          this.getSlots(this._thirdDayList, 'thirdDay');
        }, 1000);
      }
    }
  }

  getSlots(arr: any, name: any) {
    let startTime = '';
    let endTime = '';
    let count = 0;
    let arraySlots: Array<any> = [];
    let id = '';

    arr.forEach((element: any, index: any, array: any) => {
      if (index !== 0 && index !== array.length - 1) {
        if (index % Number(this.serviceCarts.totalTimeConsume) == 0) {
          count++;
          endTime = element['time'];
          id = startTime.replace(":", '') + '' + endTime.replace(":", '');
          arraySlots.push({ start: startTime, end: endTime, time: id, id: name + '' + id, click: false, startNum: Number(startTime.replace(":", '')), endNum: Number(endTime.replace(":", '')) });
          startTime = element['time'];
        }
      } else if (index == array.length - 1) {
        count++;
        endTime = element['time'];
        id = startTime.replace(":", '') + '' + endTime.replace(":", '');
        arraySlots.push({ start: startTime, end: endTime, time: id, id: name + '' + id, click: false, startNum: Number(startTime.replace(":", '')), endNum: Number(endTime.replace(":", '')) });
      } else {
        startTime = element['time'];
      }
    });
    console.log(arraySlots);
    if (name == 'today') {
      this._todaySlots = arraySlots;
    } else if (name == 'secondDay') {
      this._secondDaySlots = arraySlots;
    } else if (name == 'thirdDay') {
      this._thirdDaySlots = arraySlots;
    }

  }

  checkBooking(start: any, end: any, date: any) {
    let _date = formatDate(date, "ddMMyyyy", 'en-US');
    let _start = start.replace(":", "");
    let _end = end.replace(":", "");
    let result = '';
    let status = false;

    for (let index = 0; index < this.bookings.length; index++) {
      const element = this.bookings[index];
      if (element['bookingDate'] === Number(_date)) {
        if (Number(_end) >= element['start'] && Number(_start) <= element['start']) {
          result = 'start';
          break;
        }
        if (Number(_start) <= element['end'] && Number(_end) >= element['end']) {
          result = 'start';
          break;
        }
      }
    }
    return result;
  }

  showCoupon() {
    $('#checkout_coupon').slideToggle();
  }

  getcurrenttimehour() {
    let hour = '';
    let min = '';
    let i = this.today.getHours();
    let j = this.today.getMinutes();

    if (i < 10) {
      hour = '0' + i;
    } else {
      hour = i.toString();
    }

    if (j < 10) {
      min = '0' + j;
    } else {
      min = j.toString();
    }

    this.currenttime = Number(hour + '' + min);
  }

  applyCopon() {
    this.apiS.getCouponByCode(this.couponCode).subscribe((data) => {
      if (data['data'].length > 0) {
        if (data['data'][0]['status'] === 1) {
          this.serviceCarts.discountPercentage = data['data'][0]['discount'];
          this.serviceCarts.discountApply();
          this.appC.successStackBar("Coupon Code Apply");
        } else {
          this.appC.errorStackBar("Invalid Coupon Code");
        }
      } else {
        this.appC.errorStackBar("Invalid Coupon Code");
      }
    });
  }



  selectSloct(item: any, name: any) {
    let array = [];
    if (name == 'today') {
      array.push({ start: item['start'], end: item['end'], id: item['time'], day: this._today });
      this.selectedSlotArray = array;
      this.bookingDate = this.today;
      this._todaySlots.forEach((element) => {
        if (element['id'] === item['id']) {
          element['click'] = true;
        } else {
          element['click'] = false;
        }
      });
    } else if (name == 'secondDay') {
      array.push({ start: item['start'], end: item['end'], id: item['time'], day: this._secondDay });
      this.selectedSlotArray = array;
      this.bookingDate = this.secondDay;
      this._secondDaySlots.forEach((element) => {
        if (element['id'] === item['id']) {
          element['click'] = true;
        } else {
          element['click'] = false;
        }
      });
    } else if (name == 'thirdDay') {
      array.push({ start: item['start'], end: item['end'], id: item['time'], day: this._thirdDay });
      this.selectedSlotArray = array;
      this.bookingDate = this.thirdDay;
      this._thirdDaySlots.forEach((element) => {
        if (element['id'] === item['id']) {
          element['click'] = true;
        } else {
          element['click'] = false;
        }
      });
    }
  }

  payment() {
    if (this.selectedSlotArray.length > 0) {
      this.razorPay();
      this.loading = true;
    } else {
      this.appC.errorStackBar("Please Select Slot");
    }
  }

  razorPay() {
    this.RAZORPAY_OPTIONS.amount = Math.round(this.serviceCarts.totalPayAmount) + '00';
    this.RAZORPAY_OPTIONS.prefill.name = this.name;
    this.RAZORPAY_OPTIONS.prefill.email = this.email;
    this.RAZORPAY_OPTIONS.prefill.contact = this.mobile;
    this.RAZORPAY_OPTIONS.modal = {
      "ondismiss": function () {
        $("#closeForm").click();
      }
    };
    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);
    // this.showPopup();
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
          this.createBookings();
        }, 1000);
      }
    });
  }

  createBookings() {
    let count = 0;
    this.userS.createUserBookings("PAID", this.couponCode, this.serviceCarts.discountAmount, this.serviceCarts.totalPayAmount, this.serviceCarts.serviceCartSubtotal, this.serviceCarts.sendDataArray, this.selectedSlotArray[0], this.bookingDate).subscribe(data => {
      if (data['status'] === 'success') {
        this.appC.successStackBar("Successfully Booking Appointment");
        
        this.serviceCarts.sendDataArray.forEach((element: any) => {
          this.apiS.createTransctionWithBooking(element['priceCutWithCommision'] , 'Booking', 'deposite', 'Booking Payemnt', data['bookingdata']['_id'], element['_id'], element['_shopUser']).subscribe((dataTrans => {
            if(dataTrans['status'] === 'success'){
              this.apiS.updateWallet(element['priceCutWithCommision'], element['_shopUser']).subscribe(dataWallet => {
                count++;
              })
            }
          }));
        });

        let interval = setInterval(() =>{ 
          if(count === this.serviceCarts.sendDataArray.length){
            clearInterval(interval);
            this.loading = false;
            this.clear();
            this.serviceCarts.allClearFirlds();
            this.router.navigate(['/']).then(() => {
              location.reload();
            });
          }
        });
      }
    });
  }

  clear() {
    this.todayOpen = '';
    this.todayClosed = '';
    this.secondDayOpen = '';
    this.secondDayClosed = '';
    this.thirdDayOpen = '';
    this.thirdDayClosed = '';

    this._todayArray = [];
    this._secondDayArray = [];
    this._thirdDayArray = [];

    this._todayList = [];
    this._secondDayList = [];
    this._thirdDayList = [];

    this._todaySlots = [];
    this._secondDaySlots = [];
    this._thirdDaySlots = [];
  }

}
