import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { RoomComponent } from './room/room.component';
import { CreateroomComponent } from './createroom/createroom.component';
import { JoinroomComponent } from './joinroom/joinroom.component';
import { AddpopoverComponent } from './addpopover/addpopover.component';
import { AddfriendComponent } from './addfriend/addfriend.component';
import { AdddetailinfoComponent } from './adddetailinfo/adddetailinfo.component';
import { PrivateroomComponent } from './privateroom/privateroom.component';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FirebaseuiComponent } from './firebaseui/firebaseui.component';
import { WebsocketService } from '../services/websocket.service';
import { FirebaseWebsocketService } from '../services/firebasewebsocket.service';
@NgModule({
  declarations: [AppComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    RoomComponent,
    CreateroomComponent,
    JoinroomComponent,
    AddpopoverComponent,
    AddfriendComponent,
    AdddetailinfoComponent,
    PrivateroomComponent,
    FirebaseuiComponent
  ],
  entryComponents: [
    AddpopoverComponent
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LocalNotifications,
    { provide: WebsocketService, useClass: FirebaseWebsocketService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
