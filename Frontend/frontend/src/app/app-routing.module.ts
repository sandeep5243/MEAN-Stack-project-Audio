import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AudioListComponent } from './components/audio-list/audio-list.component';
import { AudioFormComponent } from './components/audio-form/audio-form.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', canActivate: [authGuard], component: AudioListComponent },
  { path: 'add', canActivate: [authGuard], component: AudioFormComponent },
  { path: 'edit/:id', canActivate: [authGuard], component: AudioFormComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
