import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersCheckoutComponent } from './providers-checkout.component';

describe('ProvidersCheckoutComponent', () => {
  let component: ProvidersCheckoutComponent;
  let fixture: ComponentFixture<ProvidersCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvidersCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
