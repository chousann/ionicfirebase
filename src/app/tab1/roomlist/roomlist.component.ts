import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { CreateroomComponent } from '../../createroom/createroom.component';
import { PopoverController } from '@ionic/angular';
import { AddpopoverComponent } from 'src/app/addpopover/addpopover.component';
@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.scss'],
})
export class RoomlistComponent implements OnInit {

  public roomList: Array<any> = new Array<any>();
  public popover: any;
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private popoverController: PopoverController
  ) {
  }

  ngOnInit() {
    let currentUser = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/rooms').on('value', snapshot => {
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
