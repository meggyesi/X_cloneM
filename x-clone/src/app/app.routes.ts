import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'feed', loadComponent: () => import('./feed/feed.component').then((c) => c.FeedComponent), canActivate: [authGuard] },
    { path: 'grok', loadComponent: () => import('./grok/grok.component').then((c) => c.GrokComponent), canActivate: [authGuard] },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: '**', redirectTo: 'login' }
];
