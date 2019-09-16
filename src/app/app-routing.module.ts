import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { JoinroomComponent } from './joinroom/joinroom.component';
import { CreateroomComponent } from './createroom/createroom.component';
import { RoomComponent } from './room/room.component';
import { AddfriendComponent } from './addfriend/addfriend.component';
import { AdddetailinfoComponent } from './adddetailinfo/adddetailinfo.component';
import { PrivateroomComponent } from './privateroom/privateroom.component';
import { FirebaseuiComponent } from './firebaseui/firebaseui.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'top',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'logout', component: LogoutComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'room', component: RoomComponent
  },
  {
    path: 'createroom', component: CreateroomComponent
  },
  {
    path: 'joinroom', component: JoinroomComponent
  },
  {
    path: 'addfriend', component: AddfriendComponent
  },
  {
    path: 'adddetailinfo', component: AdddetailinfoComponent
  },
  {
    path: 'privateroom', component: PrivateroomComponent
  },
  {
    path: 'firebaseui', component: FirebaseuiComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
