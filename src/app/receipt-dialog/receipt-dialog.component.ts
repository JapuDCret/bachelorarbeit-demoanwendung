import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Receipt } from 'src/app/shared/order-svc/order.service';

@Component({
  selector: 'app-receipt-dialog',
  templateUrl: './receipt-dialog.component.html',
  styleUrls: ['./receipt-dialog.component.css']
})
export class ReceiptDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Receipt) { }

  ngOnInit(): void {
  }

  goToTheShop(): void {
    window.location.reload();
  }

}
