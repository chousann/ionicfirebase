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
export class Tab2Page implements OnInit {
  public friendList: Array<any> = new Array<any>();
  public popover: any;
  public freshFlag: boolean;
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private popoverController: PopoverController
  ) {
    this.freshFlag = true;
  }

  ngOnInit() {
    let currentUser = firebase.auth().currentUser.uid;
    this.getFriends();
  }

  getFriends() {
    let currentUser = firebase.auth().currentUser.uid;
    firebase.database().ref('/friends/' + firebase.auth().currentUser.uid).on('value', snapshot => {
      let rawList = [];
      firebase.database().ref('/users').once('value', users => {
        snapshot.forEach(snap => {
          rawList.push({
            key: snap.key,
            name: users.child(snap.key).val().displayName,
            photoURL: users.child(snap.key).val().photoURL,
          });
          return false
        });
        this.friendList = rawList;
        console.log(this.friendList);
        this.freshFlag = false;
      });
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
