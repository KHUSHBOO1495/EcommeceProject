import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-allproduct',
  imports: [NgFor],
  templateUrl: './allproduct.component.html',
  styleUrl: './allproduct.component.css'
})
export class AllproductComponent {
  products: Product[] = []; 
  category_id = null;
  constructor(private _activeRoute:ActivatedRoute, private _api:ProductService){}

  ngOnInit(): void {
    this.category_id = this._activeRoute.snapshot.params['id'];
    console.log(this.category_id);
    if (this.category_id) {
      this.getProductsByCategory(this.category_id);
    }
  }

  // Method to fetch products by category ID
  getProductsByCategory(categoryId: string): void {
    this._api.getAll().subscribe((res:any)=>{
      this.products=res;
      this.products = this.products.filter(product => product.category_id === categoryId)
    })
  }
}
