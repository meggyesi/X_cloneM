import {Component, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { MaterialModule } from '../../material-module';
import { CommonModule } from '@angular/common';
import { Tweet } from '../model/Tweet';
import { TweetService } from '../services/feed.service';
import { UserService } from '../services/user.service';
import { Route, Router } from '@angular/router';
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import { EventEmitter } from '@angular/core';
import {EditDialogComponent} from "../edit-dialog/edit-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentDialogComponent} from "../comment-dialog/comment-dialog.component";
import { Comment } from '../model/Comment';
import { CommentCardComponent } from '../comment-card/comment-card.component';

@Component({
  selector: 'tweet-card',
  standalone: true,
  imports: [MaterialModule, CommonModule, CommentCardComponent],
  templateUrl: './tweet-card.component.html',
  styleUrl: './tweet-card.component.scss'
})
export class TweetCardComponent implements OnChanges {

  isLiked: boolean = false;
  isCommentsVisible: boolean = false;
  isFollowed: boolean = false;
  isOwner: boolean = false;
  comments: Comment[] = [];
  @Input()
  tweet!: Tweet;
  @Output() tweetDeleted = new EventEmitter<string>();
  @Output() tweetUpdated = new EventEmitter<Tweet>();

  constructor(
    private tweetService: TweetService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ){}
  
  ngOnInit(): void {
    this.isLikedTweet();
    if (this.tweet && this.tweet.userId) {
      this.isUserFollowed(this.tweet.userId);
      this.checkTweetOwnership(this.tweet.userId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tweet'] && !changes['tweet'].isFirstChange()) {
      this.isLikedTweet();
      if (this.tweet && this.tweet.userId) {
        this.isUserFollowed(this.tweet.userId);
      }
    }
  }

  isUserFollowed(userId: string){
   
  }

  followUser(userId: string){
    if (!this.isFollowed){
      this.userService.followUserById(userId).subscribe({
        next: (data) => {
          this.snackBar.open('Followed!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
          this.isUserFollowed(userId)
        }
      })
    }
    else {
      this.userService.unfollowUserById(userId).subscribe({
        next: (data) => {
          this.snackBar.open('Unfollowed!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
          this.isUserFollowed(userId)
        }
      })
    }
  }

  isLikedTweet(){
    if(this.tweet){
      this.tweetService.isLiked(this.tweet._id as string).subscribe({
        next: (data: any) => {
          this.isLiked = data.isLiked;
        }
      });
    }
    else{
      {return}
    }
  }

  likeTweet() {
    if(!this.isLiked){
      this.tweetService.likeTweet(this.tweet._id as string).subscribe({
        next: (data : any) => {
          this.isLiked = true;
          this.tweet.likeCount = data.status as string;
        }
      });
    }
    else{
      this.tweetService.unlikeTweet(this.tweet._id as string).subscribe({
        next: (data : any) => {
          this.isLiked = false;
          this.tweet.likeCount = data.status as string;
        }
      });
    }
  }

  commentOnTweet() {
    this.openCommentDialog();
  }

  openCommentDialog() {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '500px',
      data: {
        tweetId: this.tweet._id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTweet(this.tweet._id as string);
      }
    });
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

  getTweet(id: string): void {
    this.tweetService.getTweetById(id).subscribe({
      next: (data: any) => {
        this.tweet = data.tweet;
        this.tweet.commentCount = data.commentCount;
        this.tweet.likeCount = data.likeCount;
      }
    });
  }

  openDeleteConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this tweet?',
        submitBtnText: 'Delete',
        tweetId: this.tweet._id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTweet();
        this.tweetDeleted.emit(this.tweet._id);
      }
    });
  }

  deleteTweet() {
    if (this.tweet._id){
      this.tweetService.deleteTweetbyId(this.tweet._id).subscribe({
        next: (data) => {
          this.snackBar.open('Success!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { tweetText: this.tweet.text }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTweet(result.tweetText);
      }
    });
  }

  updateTweet(text: string) {
    if (this.tweet._id){
      this.tweetService.editTweetbyId(this.tweet._id, text).subscribe({
        next: (data: any) => {
          this.snackBar.open('Edit tweet successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
          this.getTweet(data._id);
          this.tweetUpdated.emit(data);
        }
      });
    }
    else {
      this.snackBar.open('There is no ID!', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }
  }

  showComments() {
    this.isCommentsVisible = !this.isCommentsVisible;
    if (this.isCommentsVisible && this.tweet._id) {
      this.tweetService.getCommentsbyParentId(this.tweet._id).subscribe({
        next: (data: any) => {
          this.comments = data;
        }
      });
    }
  }

  checkTweetOwnership(userId: string) {
    this.userService.getUserId().subscribe({
      next: (currentUser: any) => {
        this.isOwner = currentUser._id.toString() === this.tweet.userId?.toString();
      }
    });
  }
}