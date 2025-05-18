import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {Comment} from "../model/Comment";
import {TweetService} from "../services/feed.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {EditDialogComponent} from "../edit-dialog/edit-dialog.component";

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    NgIf
  ],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})
export class CommentCardComponent implements OnInit{

  isLiked: boolean = false
  @Input()
  comment!: Comment;
  @Output() tweetDeleted = new EventEmitter<string>();

  constructor(
    private tweetService : TweetService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ){



  }
  ngOnInit(): void {
    console.log(this.comment)
    this.isLikedTweet()
  }

  openTweet(){
    console.log(this.comment._id)
    this.navigate("/tweet/" + this.comment._id)
  }

  isLikedTweet(){
    if(this.comment){
      this.tweetService.isLiked(this.comment._id as string).subscribe({
        next: (data: any) =>{
          console.log(data)
          this.isLiked = data.isLiked
        },error: (error) =>{
          console.log(error)
        }
      })
    }
    else{
      {return}
    }
  }

  likeTweet() {
    if(!this.isLiked){
      console.log('Liked the tweet!');
      console.log(this.comment._id)
      this.tweetService.likeTweet(this.comment._id as string).subscribe({
        next: (data : any) =>{
          console.log(data)
          this.isLiked = true;
          this.comment.likeCount = data.status as string
        },error: (error) =>{
          console.log(error)
        }
      })
    }
    else{
      console.log('Unlike tweet')
      this.tweetService.unlikeTweet(this.comment._id as string).subscribe({
        next: (data : any) =>{
          console.log(data)
          this.isLiked = false;
          this.comment.likeCount = data.status as string
        },error: (error) =>{
          console.log(error)
        }
      })
    }

  }

  commentOnTweet() {
    // Handle comment functionality
    console.log('Comment on the tweet!');
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

  getTweet(id:string):void{
    this.tweetService.getTweetById(id).subscribe({
      next: (data: any) =>{
        console.log(data)
        this.comment = data.tweet
        this.comment.commentCount = data.commentCount
        this.comment.likeCount = data.likeCount
      },error: (error) =>{
        console.log(error)
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
        tweetId: this.comment._id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTweet();
        this.tweetDeleted.emit(this.comment._id);
      }
    });
  }


  deleteTweet() {
    if (this.comment._id){
      this.tweetService.deleteTweetbyId(this.comment._id).subscribe({
        next: (data) =>{
          console.log(data)
          this.snackbar.open('Success!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        },error: (error) =>{
          console.log(error)
          this.snackbar.open('Something went wrong!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      })
    }
    else {
      this.snackbar.open('There is no ID!', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { tweetText: this.comment.text } // Pass current tweet text
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.updateTweet(result.tweetText);
      }
    });
  }

  updateTweet(text: string) {
    console.log(text)
    if (this.comment._id){
      this.tweetService.editTweetbyId(this.comment._id,text).subscribe({
        next: (data:any) =>{
          console.log(data)
          this.snackbar.open('Edit tweet succesfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
          this.getTweet(data._id)
        }, error: (error) =>{
          console.log(error)
          this.snackbar.open('Something went wrong!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      });

    }
    else {
      this.snackbar.open('There is no ID!', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }
    //this.tweet.text = text;
  }

}
