import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MaterialModule } from '../material-module';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MaterialModule
  ],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss'
})
export class MenubarComponent {

  badgevisible = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  badgevisibility() {
    this.badgevisible = true;
  }

  navigateToFeed() {
    this.router.navigateByUrl('/feed');
  }

  navigateToProfile() {
    this.router.navigateByUrl('/profile');
  }

  navigateToGrok() {
    this.router.navigateByUrl('/grok');
  }

  logout() {
    this.authService.logout().subscribe({
      next: (data: string) => {
        console.log(data);
        this.router.navigateByUrl('/login');
      }, error: (err: Error) => {
        console.log(err);
      }
    });
  }

}
