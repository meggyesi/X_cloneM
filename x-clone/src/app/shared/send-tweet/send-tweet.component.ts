import {Component, EventEmitter, Output} from '@angular/core';
import { MaterialModule } from '../../material-module';
import { CommonModule } from '@angular/common';
import { TweetService } from '../services/feed.service';
import { Tweet } from '../model/Tweet';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'send-tweet',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './send-tweet.component.html',
  styleUrl: './send-tweet.component.scss'
})
export class SendTweetComponent {

  tweetText: string = '';
  @Output() tweetCreated = new EventEmitter<boolean>();

  constructor(
    private tweetService: TweetService,
    private snackbar: MatSnackBar
  ) { }

  sendTweet() {
    console.log('Sending tweet:', this.tweetText);
    let tweet = new Tweet(this.tweetText)
    this.tweetService.postTweet(tweet).subscribe({
      next: (data) =>{
        console.log(data)
        this.snackbar.open('Tweet sent successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.tweetCreated.emit(true)
      }, error: (error) =>{
        console.log(error)
        this.snackbar.open('Failed to send tweet.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.tweetCreated.emit(false)
      }
    })
    this.tweetText = ''; // Clear the input after sending
  }

}
