import { CommonModule, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';
import { FeedbackService } from '../feedback.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  imports: [NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault,CommonModule, NgIf, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product_id: any;
  productData: any = {};
  feedback: any[] = [];
  newComment: any = { rating: '', text: '' };
  quantity: number = 1;

  constructor(private _activeRoute: ActivatedRoute, private _apiProduct: ProductService, private _apiCart: CartService, private _feedbackService: FeedbackService) { }

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

  orderNow() {

  }

}
