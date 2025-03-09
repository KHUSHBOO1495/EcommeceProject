import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  apiUrl = 'http://localhost:3000/cart'

  constructor(private _http:HttpClient) { }

  getAll(){
    return this._http.get(this.apiUrl+"/products", {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  insert(productId:any, quantity:any){
    return this._http.post(this.apiUrl,{ productId, quantity }, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  delete(cartId:any, productId:any){
    return this._http.delete(this.apiUrl+"/"+cartId, {body: { productId },headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  update(cartId:any, productId:any, quantity:any){
    return this._http.patch(this.apiUrl+"/"+cartId, { productId, quantity }, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
}
