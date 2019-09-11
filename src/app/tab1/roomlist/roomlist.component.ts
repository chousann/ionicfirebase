import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { CreateroomComponent } from '../../createroom/createroom.component';
@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.scss'],
})
export class RoomlistComponent implements OnInit {

  public roomList: Array<any> = new Array<any>();
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    let currentUser = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/rooms').on('value', snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        rawList.push({
          key: snap.key,
          name: snap.val().roomName,
          id: snap.val().roomId
        });
        return false
      });
      this.roomList = rawList;
      console.log(this.roomList);
    });
  }

  openRoom(roomId: any, roomName: any) {
    this.router.navigate(['/room', {id: roomId, name: roomName}]);
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

}
