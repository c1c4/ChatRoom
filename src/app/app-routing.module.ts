import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatRoomComponent } from './chat/chat-room.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';

const homeRoute = '/login';

const routes: Routes = [
  { path: '', redirectTo: `${homeRoute}`, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'chatRoom', component: ChatRoomComponent },
  { path: 'registration', component: UserComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
