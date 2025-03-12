import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';
import { ProductService } from '../product.service';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-wishlist',
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  constructor(private _apiWishlist: WishlistService, private _apiCart: CartService, private _apiProduct: ProductService) { }
  
  wishlistProducts: any[] = [];
  suggestProducts:any [] = [];
  quantity: number = 1;
  
  ngOnInit() {
    this.getAllWishlist();
    this.getAllProduct();
  }

  getAllWishlist(){
    this._apiWishlist.getWishlist().subscribe((res: any) => {
      this.wishlistProducts = res.products
    });
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

  removeFromWishlist(productId:any){
    this._apiWishlist.insert(productId).subscribe((res: any) => {
      this.wishlistProducts=this.wishlistProducts.filter(item => item.product_id._id!== productId)
    });
    this.getAllProduct();
  }

  addToWishlist(id: string) {
    this._apiWishlist.insert(id).subscribe((res: any) => {
      this.getAllWishlist();
      this.getAllProduct();
    })
  }
  
  getAllProduct() {
    this._apiProduct.getAll().subscribe((res: any) => {
      if (!this.wishlistProducts.length) return;
  
      const wishlistCategoryIds = this.wishlistProducts.map((item: any) => item.product_id.category_id);
      const wishlistProductIds = this.wishlistProducts.map(item => item.product_id._id);
  
      this.suggestProducts = res
        .filter((p: any) =>
          p.product_stock > 2 &&
          p.average_rating >= 4 &&
          wishlistCategoryIds.includes(p.category_id) &&
          !wishlistProductIds.includes(p._id)
        )
        .slice(0, 3);
    }); 
  }
}
