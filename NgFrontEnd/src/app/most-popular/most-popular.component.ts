import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from "sweetalert2";
import { CartService } from '../cart.service';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-most-popular',
  imports: [NgFor,NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, RouterLink],
  templateUrl: './most-popular.component.html',
  styleUrl: './most-popular.component.css'
})
export class MostPopularComponent {
  products: Product[] = [];
  wishlistProductIds: string[] = [];
  quantity: number = 1;

  constructor(private _activeRoute: ActivatedRoute, private _apiProduct: ProductService, private _apiCart: CartService, private _apiWishlist: WishlistService) { }
  
  ngOnInit(): void {
    this.loadWishlist();
    this.getAllProduct();
  }

  
    loadWishlist() {
      this._apiWishlist.getWishlist().subscribe((res: any) => {
        if (res.products) {
          this.wishlistProductIds = res.products.map((p: any) => p.product_id._id);
        }
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
  
    isInWishlist(id: string): boolean {
      return this.wishlistProductIds.includes(id);
    }
  
    addToWishlist(id: string) {
      this._apiWishlist.insert(id).subscribe((res: any) => {
    
        if (res.status) {
          if (!this.isInWishlist(id)) {
            this.wishlistProductIds.push(id);
          }
        } else {
          this.wishlistProductIds = this.wishlistProductIds.filter(pid => pid !== id);
        }
    
        // Show SweetAlert with dynamic message from response
        Swal.fire({
          title: res.message,  // Show response message as title
          text: 'Your wishlist has been updated successfully.',
          icon: res.status ? 'success' : 'info',  // Success for added, Info for removed
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: false,
          background: '#f9f9f9',
          color: '#333',
          iconColor: res.status ? '#4CAF50' : '#FFA500', // Green for success, Orange for removed
          showClass: {
            popup: 'animate__animated animate__fadeInRight'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutRight'
          }
        });
    
      });
    }

    getAllProduct() {
      this._apiProduct.getAll().subscribe((res: any) => {
        this.products = res.filter((p:any) => p.average_rating >= 4.5).sort((a:any, b:any) => b.total_ratings - a.total_ratings).slice(0, 10);
      })
    }
}

