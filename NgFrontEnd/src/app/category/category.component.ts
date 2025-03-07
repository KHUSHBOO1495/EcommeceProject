import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiCategoryService } from '../api-category.service';
import { Category } from '../category';

@Component({
  selector: 'app-category',
  imports: [NgFor,RouterLink],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  data:Category[] =[];
  constructor(private _api:ApiCategoryService,private _router:Router){
    this._api.getAll().subscribe((res:any)=>{
      this.data=res;
    })
  }

  getProductByCat(id:any){
    this._router.navigate(['product',id])
  }
}
