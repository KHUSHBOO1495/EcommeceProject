import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiCategoryService {
  apiUrl = 'http://localhost:3000/category'

  constructor(private _http:HttpClient) { }

  getAll(){
    return this._http.get(this.apiUrl);
  }
}
