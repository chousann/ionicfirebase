import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { WebsocketService } from '../../services/websocket.service';

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
    private loadingController: LoadingController,
    private websocketService: WebsocketService
  ) {
    this.user = '';
    this.password = '';
  }

  ngOnInit() { }

  async signup() {
    const loader = await this.loadingController.create();
    await loader.present();

    this.websocketService.signup(this.user, this.password)
      .then(data => {
        this.errorFlag = false;
        this.errorMessage = '';
        loader.dismiss();
        this.router.navigate(['/adddetailinfo']);
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
