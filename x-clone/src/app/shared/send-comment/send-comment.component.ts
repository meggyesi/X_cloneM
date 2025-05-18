import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {TweetService} from "../services/feed.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Tweet} from "../model/Tweet";
import {Comment} from "../model/Comment";

@Component({
  selector: 'send-comment',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule
    ],
  templateUrl: './send-comment.component.html',
  styleUrl: './send-comment.component.scss'
})
export class SendCommentComponent {
  commentText: any;
  @Input() parentId!: string
  @Output() postComment: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(
    private tweetService: TweetService,
    private snackbar: MatSnackBar
  ) {
  }

  sendComment() {
    console.log('Sending tweet:', this.commentText);
    this.tweetService.postComment(this.parentId, this.commentText).subscribe({
      next: (data) =>{
        console.log(data)
        this.snackbar.open('Success!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.postComment.emit(true)
      },error: (error) =>{
        console.log(error)
        this.snackbar.open('Something went wrong!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.postComment.emit(false)
      }
    })
    this.commentText = ''
  }
}
