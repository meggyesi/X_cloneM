import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MaterialModule} from "../../material-module";
import {CommonModule} from "@angular/common";
import {TweetService} from "../services/feed.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private tweetService:TweetService,
              private snackbar: MatSnackBar) { }
}
