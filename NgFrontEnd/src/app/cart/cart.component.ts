import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';
import { OrderService } from '../order.service';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-cart',
  imports: [NgFor, FormsModule, NgIf, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartId = ''
  cartProduct: any[] = [];
  subtotal: number = 0;
  total: number = 0;
  totalItem: number = 0;
  showAddressForm: boolean = false;
  shippingAddress: any = ''

  constructor(private _router: Router,private _apiCart: CartService, private _apiOrder: OrderService, private _apiPay: PaymentService) { }

  ngOnInit() {
    this.getAllCart();
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

  getAllCart() {
    this._apiCart.getAll().subscribe((res: any) => {
      this.totalItem = res.quantity;
      this.cartProduct = res.products
      this.cartId = res._id
      this.calculateTotal();
    })
  }

  removeFromCart(productId: string) {
    this._apiCart.delete(this.cartId, productId).subscribe(
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

  updateCart(productId: string, quantity: number, stock: number) {
    if (quantity < 1 || quantity > 10 || quantity > stock) {
      return;
    }
    const itemIndex = this.cartProduct.findIndex(item => item._id === productId);
    if (itemIndex !== -1) {
      this.cartProduct[itemIndex].quantity = quantity;
    }

    this._apiCart.update(this.cartId, productId, quantity).subscribe((res: any) => {
      this.totalItem = this.cartProduct.reduce((sum, item) => sum + item.quantity, 0);
      this.calculateTotal();
    })
  }

  toggleAddressForm() {
    this.showAddressForm = true;
  }

  placeOrder() {
    this._apiOrder.orderFromCart(this.shippingAddress).subscribe((res: any) => {
      console.log(res)
      this.showPaymentOptions(res.order._id);
      // Swal.fire({
      //   title: 'Order Placed Successfully!',
      //   text: 'Your order has been confirmed. You will receive a confirmation email shortly.',
      //   icon: 'success',
      //   confirmButtonText: 'OK',
      //   confirmButtonColor: '#4CAF50', // Green Button
      //   background: '#f9f9f9', // Light Background
      //   color: '#333', // Text Color
      //   timer: 3000, // Auto-close after 3 seconds
      //   timerProgressBar: true, // Show progress bar
      //   showClass: {
      //     popup: 'animate__animated animate__fadeInDown' // Animation for showing
      //   },
      //   hideClass: {
      //     popup: 'animate__animated animate__fadeOutUp' // Animation for hiding
      //   }
      // }).then(() => {
      //   // Redirect to order history or home page after confirmation
      //   // this._router.navigate(['/order-history']);
      // });
      this.getAllCart();
    })
  }

  showPaymentOptions(orderId: string) {
    Swal.fire({
      title: 'Select Payment Method',
      text: 'Choose how you want to pay for your order.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Pay with Razorpay',
      cancelButtonText: 'Cash on Delivery (COD)',
      confirmButtonColor: '#007bff', // Blue for Razorpay
      cancelButtonColor: '#28a745', // Green for COD
      background: '#f9f9f9',
      color: '#333'
    }).then((result) => {
      if (result.isConfirmed) {
        // User chose Razorpay
        // this.payWithRazorpay(orderId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User chose COD
        this.payWithCOD(orderId);
      }
    });
  }

  payWithCOD(orderId:any){
    this._apiPay.payCOD(orderId).subscribe((res:any)=>{
      Swal.fire({
        title: 'COD Selected',
        text: 'Your order has been placed successfully. Pay upon delivery.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4CAF50'
      }).then(() => {
        // this._router.navigate(['/order-history']); // Redirect user
      });
    })
  }
}
