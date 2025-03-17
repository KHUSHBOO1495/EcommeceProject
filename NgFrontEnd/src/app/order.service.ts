import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  apiUrl = 'http://localhost:3000/order';

  constructor(private _http:HttpClient) { }

  orderFromCart(shipping_address:any){
    return this._http.post(this.apiUrl+"/cart",{ shipping_address }, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  orderSingle(product_id:any, quantity:any, shipping_address:any){
    return this._http.post(this.apiUrl,{ product_id, quantity, shipping_address }, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  getOrder(){
    return this._http.get(this.apiUrl+"/user", {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  getOrderById(Id:any){
    return this._http.get(this.apiUrl+"/"+Id, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
}
