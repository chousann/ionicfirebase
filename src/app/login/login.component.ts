import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { WebsocketService } from '../../services/websocket.service';

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
    private loadingController: LoadingController,
    private WebsocketService: WebsocketService
  ) {
    this.errorFlag = false;
    this.errorMessage = '';
  }

  ngOnInit() { }

  async login() {
    const loader = await this.loadingController.create();
    await loader.present();

    this.WebsocketService.login(this.user, this.password)
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
    this.WebsocketService.logout().then(authData => {
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

  logginwithgoogle1() {
    this.WebsocketService.logginwithgoogle().then(function (result) {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result;
        // ...
      }
      // The signed-in user info.
      var user = result.user;
      console.log(result);
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  logginwithfirebaseui() {
    this.router.navigate(['/firebaseui'])
  }
}
