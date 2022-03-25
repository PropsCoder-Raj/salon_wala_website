import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss']
})
export class TermsConditionComponent implements OnInit {

  constructor(public title: Title) {
    title.setTitle("Return Policy - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
  }

}
