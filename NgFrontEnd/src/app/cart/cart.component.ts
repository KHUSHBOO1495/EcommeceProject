import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  imports: [NgFor, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartId = ''
  cartProduct:any[] = [];
  subtotal: number = 0;
  total: number = 0;
  totalItem:number =0;

  constructor(private _apiCart:CartService){}

  ngOnInit() {
    this._apiCart.getAll().subscribe((res: any) => {
      this.totalItem = res.quantity;
      this.cartProduct = res.products
      this.cartId = res._id
      this.calculateTotal();
    })
  }

  calculateTotal() {
    if (this.cartProduct.length > 0) {
      this.subtotal = this.cartProduct.reduce((sum, item) => {
        return sum + (item.product_id.product_price * item.quantity);
      }, 0);
  
      this.total = this.subtotal; // Modify if you have discounts
    } else {
      this.subtotal = 0;
      this.total = 0;
    }
  }

  removeFromCart(productId: string) {
    this._apiCart.delete(this.cartId,productId).subscribe(
      (res: any) => {  
        this.cartProduct = this.cartProduct.filter(item => item._id !== productId);
        this.totalItem = this.cartProduct.reduce((sum, item) => sum + item.quantity, 0);
        
        this.calculateTotal();
      },
      (err) => {
        console.error("Error removing product:", err);
      }
    );
  }
}
