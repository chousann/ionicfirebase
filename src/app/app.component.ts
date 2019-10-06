import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private loadingController: LoadingController,
    private localNotifications: LocalNotifications,
    private websocketService: WebsocketService
  ) {
  }

  async ngOnInit() {
    await this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready().then(async () => {
      //this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.router.navigate(['/login']);
    })
      .then(async () => {
        const loader = await this.loadingController.create();
        await loader.present();
        this.websocketService.onAuthStateChanged(async (user) => {

          if (!user) {
            console.log("logout");
            await loader.dismiss();
            this.router.navigate(['/login']);
          } else {
            this.messageNotifications(user.uid);
            console.log("login");
            await loader.dismiss();
            this.router.navigate(['/']);       
          }
        });
      });
  }

  messageNotifications(uid: string) {
    this.websocketService.messageNotifications(uid, () => {
      this.localNotifications.schedule({
        text: '收到一条新消息',
        led: 'FF0000',
        sound: null
      });
    });
  }

  sendNotifications() {
    this.localNotifications.schedule({
      text: '收到一条新消息',
      led: 'FF0000',
      sound: null
    });
  }
  
}
