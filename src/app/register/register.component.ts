import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  user: string;
  password: string;

  errorFlag: boolean;
  errorMessage: string;

  constructor(
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.user = '';
    this.password = '';
   }

  ngOnInit() { }

  async signup() {
    const loader = await this.loadingController.create();
    await loader.present();

    firebase.auth().createUserWithEmailAndPassword(this.user, this.password)
      .then(authData => {
        firebase.database().ref('/users/' + authData.user.uid).set({
          displayName: authData.user.displayName,
          photoURL: authData.user.photoURL
        })
        .then(data =>{
          this.errorFlag = false;
          this.errorMessage = '';
          loader.dismiss();
          this.router.navigate(['/adddetailinfo']);
        });
      })
      .catch((error) => {
        // Handle Errors here.
        loader.dismiss();
        this.errorFlag = true;
        this.errorMessage = error.message + '(' + error.code + ')';
        // ...
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
