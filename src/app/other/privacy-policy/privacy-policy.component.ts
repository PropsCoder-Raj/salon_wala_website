import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(public title: Title) {
    title.setTitle("Privacy Policy - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
  }

}
