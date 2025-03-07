import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiUrl = 'http://localhost:3000/authentication/login'

  constructor(private _http:HttpClient) { }

  login(email:any,password:any){
    // console.log("login post")
    return this._http.post(this.apiUrl, {email, password});
  }

  // getAuthenticatedData(){
  //   const token = localStorage.getItem('token');
  //   console.log("getAuthenticatedData")
  //   if (token) {
  //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //     return this._http.get('http://localhost:3000/authentication/login', { headers });
  //   } else {
  //     throw new Error('User is not authenticated');
  //   }
  // }
}
