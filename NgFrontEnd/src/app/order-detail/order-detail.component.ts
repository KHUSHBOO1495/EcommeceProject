import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-detail',
  imports: [NgFor, RouterLink, CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {
  order: any = {};
  order_id:any = '';
  
    constructor(private _activeRoute:ActivatedRoute ,private _apiOrder: OrderService){}
  
    ngOnInit() {
      this.order_id = this._activeRoute.snapshot.params['id'];
      this.getAllOrder();
    }
  
    getAllOrder() {
      this._apiOrder.getOrderById(this.order_id).subscribe((res: any) => {
        this.order = res;
      })
    }
}
