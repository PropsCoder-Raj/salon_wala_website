import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(public title: Title) {
    title.setTitle("About Us - Salon-Wala.com");
    window.scroll(0, 0);
  }

  ngOnInit(): void {
  }

}
