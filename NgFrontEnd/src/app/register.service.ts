import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  apiUrl = 'http://localhost:3000/authentication/register';

  constructor(private _http:HttpClient) { }

  register(password:any, confirmPassword:any, phone_number:any, first_name:any, last_name:any, email:any){
    // console.log("login post")
    return this._http.post(this.apiUrl, { password, confirmPassword, phone_number, first_name, last_name, email});
  }
}
