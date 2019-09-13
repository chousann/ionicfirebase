import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { AddpopoverComponent } from 'src/app/addpopover/addpopover.component';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page  implements OnInit {
  public friendList: Array<any> = new Array<any>();
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
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/friends').on('value', snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        rawList.push({
          key: snap.key,
          room: snap.val().room,
          name: snap.val().name,
          photoURL: snap.val().photoURL
        });
        return false
      });
      this.friendList = rawList;
      console.log(this.friendList);
    });
  }

  openRoom(friend: any) {
    this.router.navigate(['/privateroom', {id: friend.room, name: friend.name, photoURL: friend.photoURL}]);
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
