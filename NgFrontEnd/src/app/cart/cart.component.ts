import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';
import { OrderService } from '../order.service';
import { PaymentService } from '../payment.service';
import { UserService } from '../user.service';


declare var Razorpay:any;

@Component({
  selector: 'app-cart',
  imports: [NgFor, FormsModule, NgIf, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartId = ''
  cartProduct: any[] = [];
  user: any = {};
  subtotal: number = 0;
  total: number = 0;
  totalItem: number = 0;
  showAddressForm: boolean = false;
  shippingAddress: any = ''

  constructor(private _router: Router,private _apiCart: CartService, private _apiOrder: OrderService, private _apiPay: PaymentService, private _apiUser: UserService) { }

  ngOnInit() {
    this.getAllCart();
    this.getUser();
  }

  getUser() {
    this._apiUser.getUser().subscribe((res: any) => {
      this.user = res;
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


  showPaymentOptions() {
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
        this._apiOrder.orderFromCart(this.shippingAddress).subscribe((res: any) => {

          this.getAllCart();
          this.payWithRazorpay(res.order._id, res.order.total_amount);
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this._apiOrder.orderFromCart(this.shippingAddress).subscribe((res: any) => {

          this.getAllCart();
        this.payWithCOD(res.order._id);
      })
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
        this._router.navigate(['/order-history']);
      });
    })
  }

  payWithRazorpay(orderId:any, orderAmount:any){
    const RazorPayOptions = {
      description: 'Sample Demo',
      currency: 'INR',
      amount: orderAmount*100,
      name: this.user.first_name,
      key: 'rzp_test_LEMyImcFyWSHFZ', // Use test key
      // image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
      prefill: {
        name: this.user.first_name,
        email: this.user.email,
        phone: this.user.phone_number,
      },
      theme: {
        color: '#c9184a'
      },
      method: {  // Force enable UPI
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
      handler: (res: any) => {
        this.verifyPayment(orderId, res.razorpay_payment_id);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment Cancelled');
        }
      }
    };
  
    const successCallBack = (paymentId: any) => {
      console.log('Payment Success:', paymentId);
    };
  
    const failureCallBack = (error: any) => {
      console.log('Payment Failed:', error);
    };
  
    Razorpay.open(RazorPayOptions, successCallBack, failureCallBack);
  }

  verifyPayment(orderId: any,payment_id:any) {
    this._apiPay.payRazor(orderId, payment_id).subscribe((res: any) => {
      Swal.fire({
        title: 'Payment Successful!',
        text: 'Your order has been confirmed.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4CAF50'
      }).then(() => {
        this._router.navigate(['/order-history']);
      });
    }, (error) => {
      Swal.fire({
        title: 'Payment Failed!',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    });
  }
  
}
