import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { from, Observable } from 'rxjs';
import { mergeMap, reduce } from 'rxjs/operators';
import { ShoppingCartDataSource, ShoppingCartItem } from './shopping-cart-datasource';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable) table: MatTable<ShoppingCartItem>;
  dataSource: ShoppingCartDataSource;
  totalSum: Observable<number>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['imagePath', 'amount', 'name', 'price'];

  ngOnInit() {
    this.dataSource = new ShoppingCartDataSource();
  }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;

    this.totalSum = this.dataSource.connect().pipe(
      mergeMap((cartItems) => from(cartItems).pipe(
        reduce<ShoppingCartItem, number>((totalPrice, cartItem) => totalPrice + (cartItem.amount * cartItem.price))
      ))
    );
  }
}
