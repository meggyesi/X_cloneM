import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MenubarComponent } from '../menubar/menubar.component';

@Component({
  selector: 'app-grok',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MenubarComponent,
  ],
  templateUrl: './grok.component.html',
  styleUrls: ['./grok.component.scss'],
})
export class GrokComponent {
  question: string = '';
  response: string = '';

  constructor(private http: HttpClient) {}

sendQuestion() {
  if (!this.question.trim()) return;

  this.response = 'Loading...';
  
  this.http.post<{response: string}>('http://localhost:5001/api/ask', { message: this.question })
    .subscribe({
      next: (res) => {
        console.log('Response from server:', res);
        if (res && res.response) {
          this.response = res.response;
        } else {
          this.response = 'Received empty response from server';
        }
      },
      error: (err) => {
        console.error('Error calling server:', err);
        
        if (err.error && err.error.details) {
          this.response = `Error: ${err.error.details}`;
        } else if (err.statusText) {
          this.response = `Error (${err.status}): ${err.statusText}`;
        } else {
          this.response = 'An error occurred while getting a response. Please try again.';
        }
      }
    });
  
  this.question = '';
}
  openSettings() {
  }
}
