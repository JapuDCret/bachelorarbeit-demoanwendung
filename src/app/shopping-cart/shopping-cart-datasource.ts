import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

export interface ShopItem {
  itemId: number;
  name: string;
  price: number;
  imagePath: string;
}

export interface ShoppingCartItem extends ShopItem {
  amount: number;
}

// TODO: replace this with real data from your application
const PRICE_TABLE: ShopItem[] = [
  { itemId: 0, name: 'Honigmelone', price: 2.50, imagePath: '/assets/fruits/cantalope.png' },
  { itemId: 1, name: 'Kokosnuss', price: 1.50, imagePath: '/assets/fruits/coconut.png' },
  { itemId: 2, name: 'Trauben (grün)', price: 1.30, imagePath: '/assets/fruits/grapes-green.png' },
  { itemId: 3, name: 'Trauben (rot)', price: 1.20, imagePath: '/assets/fruits/grapes-purple.png' },
  { itemId: 4, name: 'Pfirsich', price: 0.60, imagePath: '/assets/fruits/peach.png' },
  { itemId: 5, name: 'Birne', price: 0.35, imagePath: '/assets/fruits/pear.png' },
  { itemId: 6, name: 'Ananas', price: 1.80, imagePath: '/assets/fruits/pineapple.png' },
  { itemId: 7, name: 'Granatapfel', price: 1.40, imagePath: '/assets/fruits/pomegranate.png' },
  { itemId: 8, name: 'Wassermelone', price: 2.20, imagePath: '/assets/fruits/watermelon.png' },
];

/**
 * Data source for the ShoppingCart view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ShoppingCartDataSource extends DataSource<ShoppingCartItem> {
  data: ShoppingCartItem[];

  constructor() {
    super();

    // generate random data
    const randData = new Array<ShoppingCartItem>();

    const numOfItems = getRndInteger(3, 6);
    for (let i = 0; i < numOfItems; i++) {
      let randItemId;
      do {
        randItemId = getRndInteger(0, 9);
      } while (randData.find((shopItem) => {
        return shopItem.itemId === randItemId;
      }) != undefined);

      const randAmount = getRndInteger(1, 4);

      randData.push({
        ...PRICE_TABLE[randItemId],
        itemId: randItemId,
        amount: randAmount,
      });
    }

    this.data = randData;

    console.log('constructor(): this.data = ', this.data);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ShoppingCartItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data)
    ];

    return merge(...dataMutations).pipe(map(() => {
      return [...this.data];
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
