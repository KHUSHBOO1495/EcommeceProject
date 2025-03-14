import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  apiUrl = 'http://localhost:3000/feedback';

  constructor(private _http:HttpClient) { }

  getFeedback(productId:any){
    return this._http.get(this.apiUrl+"/product/"+productId ,{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }

  newComment(productId:any, comment:any){
    return this._http.post(this.apiUrl+"/product/"+productId , {rating: comment.rating, comment: comment.text},{headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
  }
}
