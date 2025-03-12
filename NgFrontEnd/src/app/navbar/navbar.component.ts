import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiCategoryService } from '../api-category.service';
import { Category } from '../category';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  data: Category[] = [];
  user: any = {};
  userProfileImageUrl: string = '';

  constructor(private _api: ApiCategoryService, private _router: Router, private _apiUser: UserService) {
    this._api.getAll().subscribe((res: any) => {
      this.data = res;
    })
  }

  ngOnInit() {
    this.getUser()
  }

  logout(): void {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }

  getUser() {
    this._apiUser.getUser().subscribe((res: any) => {
      this.user = res;
      this.userProfileImageUrl = this.user.profile_picture ? this.user.profile_picture : '';
    })
  }

  getProductByCat(id: any) {
    this._router.navigate(['category', id])
  }
}
