import { AfterViewInit, Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { NGXLogger } from 'ngx-logger';

import { OrderService, Receipt } from 'src/app/shared/order-svc/order.service';

@Component({
  selector: 'app-receipt-page',
  templateUrl: './receipt-page.component.html',
  styleUrls: ['./receipt-page.component.css']
})
export class ReceiptPageComponent implements OnInit, AfterViewInit {

  receipt$: Observable<Receipt>;

  constructor(
    private log: NGXLogger,
    private router: Router,
    private orderService: OrderService,
    ) { }

  ngOnInit(): void {
    this.receipt$ = this.orderService.getLastResponse();
  }

  ngAfterViewInit() {
  }

  goToTheShop(): void {
    this.log.info('goToTheShop(): navigating back to checkout');

    window.location.replace('checkout');
  }

}
