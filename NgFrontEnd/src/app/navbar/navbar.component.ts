import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiCategoryService } from '../api-category.service';
import { Category } from '../category';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgFor],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
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
