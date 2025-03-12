import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
 apiUrl = 'http://localhost:3000/payment';

  constructor(private _http:HttpClient) { }

  payCOD( order_id :any){
    return this._http.post(this.apiUrl+"/cod",{ order_id }, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
}
