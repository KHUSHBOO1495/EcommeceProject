import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  apiUrl = 'http://localhost:3000/cart'

  constructor(private _http:HttpClient) { }

  insert(productId:any, quantity:any){
    return this._http.post(this.apiUrl,{ productId, quantity }, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
}
