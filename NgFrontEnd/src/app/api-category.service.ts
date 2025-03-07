import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiCategoryService {
  apiUrl = 'http://localhost:3000/category'

  constructor(private _http:HttpClient) { }

  getAll(){
    return this._http.get(this.apiUrl, {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
}
