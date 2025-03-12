import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  imports: [NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product_id: any;
  productData: any = {};
  quantity: number = 1;

  constructor(private _activeRoute: ActivatedRoute, private _apiProduct: ProductService, private _apiCart: CartService) { }

  ngOnInit() {
    this.product_id = this._activeRoute.snapshot.params['id'];
    this._apiProduct.getProductById(this.product_id).subscribe((res: any) => {
      console.log(res)
      this.productData = res
    })
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

  orderNow() {

  }

}
