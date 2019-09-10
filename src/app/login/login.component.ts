import { Component, OnInit } from '@angular/core';

import * as firebase from "firebase/app";
import 'firebase/auth';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  user: string;
  password: string;
  
  errorFlag: boolean;
  errorMessage: string;

  constructor(
    private router: Router,
    private loadingController: LoadingController
  ) { 
    this.errorFlag = false;
    this.errorMessage = '';
  }

  ngOnInit() {}

  async login() {
    const loader = await this.loadingController.create();
    await loader.present();

    firebase.auth().signInWithEmailAndPassword(this.user, this.password)
    .then(authData => {
      this.errorFlag = false;
      this.errorMessage = '';
      loader.dismiss();
      this.router.navigate(['/top']);
    })
    .catch((error) => {
      // Handle Errors here.
      loader.dismiss();
      this.errorFlag = true;
      this.errorMessage = error.message + '(' + error.code + ')';
      // ...
    });
  }
  async logout() {
    const loader = await this.loadingController.create();
    await loader.present();
    firebase.auth().signOut().then(authData => {
      this.errorFlag = false;
      this.errorMessage = '';
      loader.dismiss();
      this.router.navigate(['/logout']);
    })
    .catch((reason) => {
      loader.dismiss();
      this.errorFlag = true;
      this.errorMessage = this.errorMessage = reason.message + '(' + reason.code + ')';
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
