import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MaterialModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'X_clone';
}
