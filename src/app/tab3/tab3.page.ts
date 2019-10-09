import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { AddpopoverComponent } from 'src/app/addpopover/addpopover.component';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  displayName: string;
  photoURL: string;
  email: string;
  constructor(
    private alertController: AlertController,
    private websocketService: WebsocketService,
    private router: Router
  ) {
    this.displayName = this.websocketService.getcurrentUser().displayName;
    this.photoURL = this.websocketService.getcurrentUser().photoURL;
    this.email = this.websocketService.getcurrentUser().email;
  }

  async exit() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: '确认退出登录？',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.websocketService.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  updateInfo() {
    this.router.navigate(['/adddetailinfo']);
  }
}