import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.scss']
})
export class RefundPolicyComponent implements OnInit {

  constructor(public title: Title) {
    title.setTitle("Return Policy - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
  }

}
