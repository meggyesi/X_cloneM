import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5001/user/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  headersTweet = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  isUserFollowed(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/isfollow/${userId}`,{withCredentials:true});
  }


  deleteUser(id:string){
    return this.http.delete<any>(`${this.apiUrl}delete-user/${id}`,{withCredentials:true});
  }

  getUserId(){
    return this.http.get(`${this.apiUrl}get-auth-id`,{withCredentials:true})
  }

  unfollowUserById(userId:string){
    return this.http.delete<any>(`${this.apiUrl}/unfollow/${userId}`,{withCredentials:true});
  }

  followUserById(userId: string): Observable<any> {
      let followjson = {
        followingId: userId
      }
      return this.http.post(this.apiUrl + "follow", followjson, {headers: this.headersTweet, withCredentials: true})
  }


}
