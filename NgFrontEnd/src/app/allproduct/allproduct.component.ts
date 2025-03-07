import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-allproduct',
  imports: [NgFor,FormsModule],
  templateUrl: './allproduct.component.html',
  styleUrl: './allproduct.component.css'
})
export class AllproductComponent {
  products: Product[] = []; 
  category_id = null;
  quantity: number = 1;
  constructor(private _activeRoute:ActivatedRoute, private _apiProduct:ProductService, private _apiCart: CartService){}

  ngOnInit(): void {
    this.category_id = this._activeRoute.snapshot.params['id'];
    if (this.category_id) {
      this.getProductsByCategory(this.category_id);
    }
  }

  addToCart(id:any){
    this._apiCart.insert(id,this.quantity).subscribe(res=>{
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

  // Method to fetch products by category ID
  getProductsByCategory(categoryId: string): void {
    this._apiProduct.getAll().subscribe((res:any)=>{
      this.products=res;
      this.products = this.products.filter(product => product.category_id === categoryId)
    })
  }
}
