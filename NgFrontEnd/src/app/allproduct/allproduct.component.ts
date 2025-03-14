import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-allproduct',
  imports: [NgFor, NgIf,FormsModule, NgSwitch, NgSwitchCase, NgSwitchDefault, RouterLink],
  templateUrl: './allproduct.component.html',
  styleUrl: './allproduct.component.css'
})
export class AllproductComponent {
  products: Product[] = [];
  wishlistProductIds: string[] = [];
  filteredProducts: Product[] = [];
  category_id = null;
  quantity: number = 1;

  selectedCategory: string = 'all';
  minPrice: number = 2000;
  maxPrice: number = 100000;
  maxPriceLimit: number = 100000;
  sortBy: string = 'none';

  constructor(
    private _activeRoute: ActivatedRoute,
    private _apiProduct: ProductService,
    private _apiCart: CartService,
    private _apiWishlist: WishlistService
  ) {}

  ngOnInit(): void {
    this.category_id = this._activeRoute.snapshot.params['id'];
    this.loadWishlist();
    if (this.category_id) {
      this.getProductsByCategory(this.category_id);
    } else {
      this.getAllProduct();
    }
  }

  loadWishlist() {
    this._apiWishlist.getWishlist().subscribe((res: any) => {
      if (res.products) {
        this.wishlistProductIds = res.products.map((p: any) => p.product_id._id);
      }
    });
  }

  addToCart(id: any) {
    this._apiCart.insert(id, this.quantity).subscribe((res) => {
      Swal.fire({
        title: 'Product Added to Cart!',
        text: 'Your item has been added successfully.',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: false,
        background: '#f9f9f9',
        color: '#333',
        iconColor: '#4CAF50',
        showClass: {
          popup: 'animate__animated animate__fadeInRight',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutRight',
        },
      });
    });
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
        this.wishlistProductIds = this.wishlistProductIds.filter((pid) => pid !== id);
      }

      Swal.fire({
        title: res.message,
        text: 'Your wishlist has been updated successfully.',
        icon: res.status ? 'success' : 'info',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: false,
        background: '#f9f9f9',
        color: '#333',
        iconColor: res.status ? '#4CAF50' : '#FFA500',
        showClass: {
          popup: 'animate__animated animate__fadeInRight',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutRight',
        },
      });
    });
  }

  getAllProduct() {
    this._apiProduct.getAll().subscribe((res: any) => {
      this.products = res;
      this.filteredProducts = [...this.products];
      this.applyFilters();
    });
  }

  getProductsByCategory(categoryId: string): void {
    this._apiProduct.getAll().subscribe((res: any) => {
      this.products = res.filter((product:any) => product.category_id === categoryId);
      this.filteredProducts = [...this.products];
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = this.products.filter(
      (product) =>
        (this.selectedCategory === 'all' || product.category_id === this.selectedCategory) &&
        product.final_price >= this.minPrice &&
        product.final_price <= this.maxPrice
    );
    this.filteredProducts = filtered;
    this.applySorting();
  }

  applySorting(): void {
    switch (this.sortBy) {
      case 'price_low':
        this.filteredProducts.sort((a, b) => a.final_price - b.final_price);
        break;
      case 'price_high':
        this.filteredProducts.sort((a, b) => b.final_price - a.final_price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'stock':
        this.filteredProducts.sort((a, b) => b.product_stock - a.product_stock);
        break;
      default:
        break;
    }
  }

  handlePriceChange() {
    this.applyFilters();
  }

  handleSortChange() {
    this.applySorting();
  }
}

