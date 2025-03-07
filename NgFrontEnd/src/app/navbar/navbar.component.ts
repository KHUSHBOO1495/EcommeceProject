import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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
    constructor(private _api:ApiCategoryService){
      this._api.getAll().subscribe((res:any)=>{
        this.data=res;
      })
    }
}
