import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-history',
  imports: [NgFor, CommonModule, RouterLink],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {
  orderList: any[] = [];

  constructor( private _apiOrder: OrderService){}

  ngOnInit() {
    this.getAllOrder();
  }

  getAllOrder() {
    this._apiOrder.getOrder().subscribe((res: any) => {
      this.orderList = res;
    })
  }
}
