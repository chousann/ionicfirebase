import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from "firebase/app";
import 'firebase/auth';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
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
    private loadingController: LoadingController
  ) {
  }

  async ngOnInit() {
    await this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready().then(async () => {
      firebase.initializeApp(firebaseConfig);
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (!firebase.auth().currentUser) {
        this.router.navigate(['/login']);
      }
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
            console.log("login");
            await loader.dismiss();
            //this.router.navigate(['/']);       
          }
        });
      });
  }
}
