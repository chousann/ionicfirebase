import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from "firebase/app";
import 'firebase/auth';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
const firebaseConfig = {
  apiKey: "AIzaSyCdi_DUL90xrv2ACCad5SNjY9d84iY7j7c",
  authDomain: "hellofirebase-76124.firebaseapp.com",
  databaseURL: "https://hellofirebase-76124.firebaseio.com",
  projectId: "hellofirebase-76124",
  storageBucket: "",
  messagingSenderId: "1025357322276",
  appId: "1:1025357322276:web:d112b29f37746d31ea60b1"
};

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
    private localNotifications: LocalNotifications
  ) {
  }

  async ngOnInit() {
    await this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready().then(async () => {
      firebase.initializeApp(firebaseConfig);
      //this.statusBar.styleDefault();
      this.splashScreen.hide();
    })
      .then(async () => {
        const loader = await this.loadingController.create();
        await loader.present();
        await firebase.auth().onAuthStateChanged(async (user) => {

          if (!user) {
            console.log("logout");
            await loader.dismiss();
            this.router.navigate(['/login']);
          } else {
            this.messageNotifications(user.uid);
            console.log("login");
            await loader.dismiss();
            //this.router.navigate(['/']);       
          }
        });
      });
  }

  messageNotifications(uid: string) {
    firebase.database().ref('/users/' + uid + '/rooms').on('value', snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        firebase.database().ref('/messages/' + snap.key + '/messageList').on('value', snapshot => {
          let rawList = [];
          this.sendNotifications();
        })
        return false
      });
    });
    firebase.database().ref('/friendmessages/' + uid).on('value', snapshot => {
      this.sendNotifications();
    });
  }

  sendNotifications() {
    this.localNotifications.schedule({
      text: '收到一条消息',
      trigger: { at: new Date(new Date().getTime() + 10) },
      led: 'FF0000',
      sound: null
    });
  }
  
}
