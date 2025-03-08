import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  apiUrl = 'http://localhost:3000/wishlist'

  constructor(private _http:HttpClient) { }

    getWishlist(){
      return this._http.get(this.apiUrl+"/products", {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
    }
  
    insert(productId:any){
      return this._http.post(this.apiUrl,{ productId }, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
    }
}
