import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Tweet } from '../model/Tweet';
import { Comment } from '../model/Comment';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  private apiUrl = 'http://localhost:5001/feed/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  headersTweet = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  getAllTweets(): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.apiUrl + "tweetswithcount", {withCredentials: true})
  }

  getTweetById(id: string) {
    const url = `${this.apiUrl}/tweets/${id}`;
    return this.http.get(url, {withCredentials: true});
  }

  getCommentsbyParentId(id: string) {
    const url = `${this.apiUrl}commentswithcount/${id}`;
    return this.http.get(url, {withCredentials: true});
  }

  postTweet(tweet: Tweet): Observable<Tweet> {
    return this.http.post<Tweet>(this.apiUrl + "tweet", tweet, {headers: this.headersTweet, withCredentials: true})
      .pipe(
        catchError(this.handleError)
      );
  }

  postComment(parentId: string, commentText: string): Observable<Comment> {
    const comment = new Comment(commentText);
    return this.http.post<Comment>(`${this.apiUrl}comments/${parentId}`, comment, {headers: this.headersTweet, withCredentials: true})
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTweetbyId(id: string) {
    const url = `${this.apiUrl}tweets/${id}`;
    return this.http.delete(url, {withCredentials: true});
  }

  editTweetbyId(id: string, text: string) {
    const url = `${this.apiUrl}tweets/${id}`;
    const data = { text: text };
    return this.http.patch(url, data, { 
      headers: this.headersTweet,
      withCredentials: true 
    });
  }

  likeTweet(tweetid: string) {
    let likejson = {
      tweetId: tweetid
    }
    return this.http.post(this.apiUrl + "like", likejson, {headers: this.headersTweet, withCredentials: true})
  }

  unlikeTweet(tweetid: string) {
    const url = `${this.apiUrl}/unlike/${tweetid}`;
    return this.http.delete(url, {withCredentials: true});
  }


  isLiked(tweetId: string): Observable<{ isLiked: boolean }> {
    const url = `${this.apiUrl}/check-like/${tweetId}`;
    return this.http.get<{ isLiked: boolean }>(url, {withCredentials: true});
  }
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}