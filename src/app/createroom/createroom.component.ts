import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-createroom',
  templateUrl: './createroom.component.html',
  styleUrls: ['./createroom.component.scss'],
})
export class CreateroomComponent implements OnInit {
  id: string;
  name: string;
  photoURL: string;
  
  errorFlag: boolean;
  errorMessage: string;
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private websocketService: WebsocketService
  ) {
    this.name = '';
    this.id= '';
    this.photoURL = '';
    this.errorFlag = false;
    this.errorMessage = '';
  }

  ngOnInit() {}

  async create() {
    const loader = await this.loadingController.create();
    await loader.present();
    this.websocketService.create(this.id, this.name, this.photoURL)
    .then(() => {
      this.errorFlag = false;
      this.errorMessage = '';
      loader.dismiss();
      this.router.navigate(['/tabs/tab1/roomlist']);
    })
    .catch(e => {
      this.errorFlag = true;
      this.errorMessage = e.message;
      loader.dismiss();
    })
  }

  back() {
    this.router.navigate(['/tabs/tab1/roomlist']);
  }

}
