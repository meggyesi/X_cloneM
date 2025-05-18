import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TweetService } from '../services/feed.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SendCommentComponent } from '../send-comment/send-comment.component';

@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    SendCommentComponent
  ],
  templateUrl: './comment-dialog.component.html',
  styleUrl: './comment-dialog.component.scss'
})
export class CommentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tweetId: string },
    private tweetService: TweetService,
    private snackBar: MatSnackBar
  ) {}

  onCommentAdded(success: boolean): void {
    if (success) {
      this.dialogRef.close(true);
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}