import { CommonModule, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';
import { FeedbackService } from '../feedback.service';
import { OrderService } from '../order.service';
import { PaymentService } from '../payment.service';
import { ProductService } from '../product.service';
import { UserService } from '../user.service';

declare var Razorpay:any;

@Component({
  selector: 'app-product-detail',
  imports: [NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault,CommonModule, NgIf, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product_id: any;
  productData: any = {};
  user: any = {};
  feedback: any[] = [];
  newComment: any = { rating: '', text: '' };
  quantity: number = 1;

  constructor(private _router: Router,private _activeRoute: ActivatedRoute, private _apiUser: UserService, private _apiPay: PaymentService,private _apiProduct: ProductService, private _apiCart: CartService, private _feedbackService: FeedbackService, private _orderService: OrderService) { }

  ngOnInit() {
    this.product_id = this._activeRoute.snapshot.params['id'];
    this._apiProduct.getProductById(this.product_id).subscribe((res: any) => {
      this.productData = res
    })
    this.getFeedback();
  }

  addToCart(id: any) {
    this._apiCart.insert(id, this.quantity).subscribe(res => {
      Swal.fire({
        title: 'Product Added to Cart!',
        text: 'Your item has been added successfully.',
        icon: 'success',
        toast: true,  // Makes it a toast (non-blocking popup)
        position: 'top-end',  // Positions it in the top-right corner
        showConfirmButton: false,  // Hides the confirm button
        timer: 2000,  // Auto-closes after 2 seconds
        timerProgressBar: false,  // Shows a progress bar
        background: '#f9f9f9',  // Light background
        color: '#333',  // Text color
        iconColor: '#4CAF50',  // Green icon color
        showClass: {
          popup: 'animate__animated animate__fadeInRight'  // Animation for showing
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutRight'  // Animation for hiding
        }
      });
    })
  }

  getFeedback() {
    this._feedbackService.getFeedback(this.product_id).subscribe((res: any) => {
      if (res.feedbacks) {
        this.feedback = res.feedbacks; // Store feedbacks in the array
      } else {
        this.feedback = [];
      }
    });
  }

  submitComment() {
    if (this.newComment.text && this.newComment.rating) {
      this._feedbackService.newComment(this.product_id, this.newComment).subscribe(res => {
        Swal.fire({
          title: 'Thank you for your feedback!',
          text: 'Your comment has been submitted successfully.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          background: '#f9f9f9',
          color: '#333',
          iconColor: '#4CAF50',
        });

        // Reset the new comment form
        this.newComment = { rating: '', text: '' };
        this.getFeedback(); // Reload feedback after submission
      }, error => {
        Swal.fire({
          title: 'Error',
          text: 'There was an issue submitting your comment. Please try again later.',
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          background: '#f9f9f9',
          color: '#333',
          iconColor: '#FF6347',
        });
      });
    }
  }
 
  orderNow(): void {
    Swal.fire({
      title: 'Enter Shipping Address',
      input: 'textarea',
      inputPlaceholder: 'Enter your shipping address here...',
      showCancelButton: true,
      confirmButtonText: 'Place order',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#dc3545',
      background: '#f9f9f9',
      color: '#333',
    }).then((result) => {
      const shippingAddress = result.value;
  
      if (shippingAddress) {
        Swal.fire({
          title: 'Select Payment Method',
          text: 'Choose how you want to pay for your order.',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Pay with Razorpay',
          cancelButtonText: 'Cash on Delivery (COD)',
          confirmButtonColor: '#007bff',  // Blue for Razorpay
          cancelButtonColor: '#28a745',  // Green for COD
        }).then((paymentResult) => {
          if (paymentResult.isConfirmed) {
            this._orderService.orderSingle(this.product_id, this.quantity, shippingAddress).subscribe((res: any) => {
              this.payWithRazorpay(res.order._id, res.order.total_amount);
            });
          } else if (paymentResult.dismiss === Swal.DismissReason.cancel) {
            this._orderService.orderSingle(this.product_id, this.quantity, shippingAddress).subscribe((res: any) => {
              this.payWithCOD(res.order._id);
            });
          }
        });
      } else {
        Swal.fire({
          title: 'Address Required!',
          text: 'Please enter a shipping address to continue.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
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
