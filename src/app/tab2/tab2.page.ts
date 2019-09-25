import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { AddpopoverComponent } from 'src/app/addpopover/addpopover.component';
import { WebsocketService } from '../../services/websocket.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public friendList: Array<any> = new Array<any>();
  public popover: any;
  public freshFlag: boolean;
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private websocketService: WebsocketService
  ) {
    this.freshFlag = true;
  }

  ngOnInit() {
    this.getFriends();
  }

  getFriends() {
    this.websocketService.onMyFriends(snapshot => {
        this.friendList = snapshot;
        console.log(this.friendList);
        this.freshFlag = false;
      });
  }

  openRoom(friend: any) {
    this.router.navigate(['/privateroom', { id: friend.key, name: friend.name, photoURL: friend.photoURL }]);
  }

  async createRoom() {
    // const modal = await this.modalController.create({
    //   component: CreateroomComponent
    // });
    // await modal.present();
    this.router.navigate(['/createroom']);
  }

  joinRoom() {
    this.router.navigate(['/joinroom']);
  }

  async add() {
    const popover = await this.popoverController.create({
      component: AddpopoverComponent,
      translucent: true,
      componentProps: {
        'callback': this.callback
      }
    });
    return await popover.present();
  }

  callback() {
    this.popover.dismiss();
  }

}
