import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrls: ['./addfriend.component.scss'],
})
export class AddfriendComponent implements OnInit {

  public userList: Array<any> = new Array<any>();
  constructor(
    private router: Router,
    private loadingController: LoadingController
  ) {
    let currentUser = firebase.auth().currentUser.uid;
    firebase.database().ref('/users').on('value', snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        rawList.push({
          key: snap.key,
          displayName: snap.val().displayName,
          photoURL: snap.val().photoURL
        });
        return false
      });
      this.userList = rawList;
      console.log(this.userList);
    });
  }

  ngOnInit() { }

  async addfriend(user: any) {

    const loader = await this.loadingController.create();
    await loader.present();
    firebase.database().ref('/privaterooms').push({
      member1: firebase.auth().currentUser.uid,
      member2: user.key
    })
    .then(data => {
      firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/friends/' + user.key).set({
        room: data.key,
        name: user.displayName,
        photoURL: user.photoURL
      });
      firebase.database().ref('/users/' + user.key + '/friends/' + firebase.auth().currentUser.uid).set({
        room: data.key,
        name: firebase.auth().currentUser.displayName,
        photoURL: firebase.auth().currentUser.photoURL
      });
    })
    .then(data => {
      loader.dismiss();
      this.router.navigate(['/tabs/tab2']);
    })
    .catch(e => {
      console.log(e);
      loader.dismiss();
    });
  }

  back() {
    this.router.navigate(['/tabs/tab1/roomlist']);
  }

}
