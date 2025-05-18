import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from '../material-module';
import { MenubarComponent } from '../menubar/menubar.component';
import { TweetCardComponent } from "../shared/tweet-card/tweet-card.component";
import { SendTweetComponent } from '../shared/send-tweet/send-tweet.component';
import { TweetService } from '../shared/services/feed.service';
import { Tweet } from '../shared/model/Tweet';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-feed',
    standalone: true,
    templateUrl: './feed.component.html',
    imports: [MatInputModule,
       MatButtonModule,
       MatCardModule,
       MaterialModule,
       MenubarComponent,
       TweetCardComponent,
       SendTweetComponent,
       CommonModule]
})
export class FeedComponent implements OnInit {

  tweetList:Tweet[] = []

  constructor(
    private authService: AuthService,
    private feedService: TweetService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAllTweets()
  }


  getAllTweets(){
     this.feedService.getAllTweets().subscribe({
      next: (data : Tweet[]) =>{
          this.tweetList = data;
      }, error: (error) =>{
      }
    })
  }

  handleTweetDeleted(tweetId: string) {
    this.tweetList = this.tweetList.filter(tweet => tweet._id !== tweetId);
  }

  handleTweetUpdated(updatedTweet: Tweet) {
    const index = this.tweetList.findIndex(tweet => tweet._id === updatedTweet._id);
    if (index !== -1) {
      this.tweetList[index] = updatedTweet;
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        this.router.navigateByUrl('/login');
      }, error: (err) => {
      }
    });
  }

  handleTweetCreation(tweet: boolean) {
    if (tweet){
      this.getAllTweets()
    }
  }
}
