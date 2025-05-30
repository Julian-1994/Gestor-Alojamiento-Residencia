import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

export const routes: Routes = [
{ path: '', redirectTo: 'login', pathMatch: 'full' },
{ path: 'login', component: LoginComponent},
{ path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
{ path: 'user', component: UserComponent, canActivate: [UserGuard] },
];


