import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { CreateroomComponent } from '../../createroom/createroom.component';
import { PopoverController } from '@ionic/angular';
import { AddpopoverComponent } from 'src/app/addpopover/addpopover.component';
import { WebsocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.scss'],
})
export class RoomlistComponent implements OnInit {

  public roomList: Array<any> = new Array<any>();
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
    this.websocketService.onMyRooms(snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        rawList.push({
          key: snap.key,
          name: snap.val().name,
          photoURL: snap.val().photoURL
        });
        return false
      });
      this.roomList = rawList;
      console.log(this.roomList);
      this.freshFlag = false;
    });
  }

  openRoom(room: any) {
    this.router.navigate(['/room', {id: room.key, name: room.name}]);
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
        'callback' : this.callback
      }
    });
    return await popover.present();
  }

  callback() {
    this.popover.dismiss();
  }

}
