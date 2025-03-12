import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'http://localhost:3000/user';

  constructor(private _http:HttpClient) { }

  getUser(){
      return this._http.get(this.apiUrl+"/user", {headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
    }
}
