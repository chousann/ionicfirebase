import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-adddetailinfo',
  templateUrl: './adddetailinfo.component.html',
  styleUrls: ['./adddetailinfo.component.scss'],
})
export class AdddetailinfoComponent implements OnInit {

  displayName: string;
  photoURL: string;
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private websocketService: WebsocketService
  ) { 
    this.displayName = '';
    this.photoURL = '';
  }

  ngOnInit() {}

  async updateDetailinfo() {
    const loader = await this.loadingController.create();
    await loader.present();
    this.websocketService.updateDetailinfo(this.displayName, this.photoURL)
    .then(() => {
      loader.dismiss();
      this.router.navigate(['/top']);
    })
    .catch(e => {
      loader.dismiss();
      console.log(e);
    });
  }

}
