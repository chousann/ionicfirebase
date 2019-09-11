import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-joinroom',
  templateUrl: './joinroom.component.html',
  styleUrls: ['./joinroom.component.scss'],
})
export class JoinroomComponent implements OnInit {
  public roomList: Array<any> = new Array<any>();
  constructor(
    private router: Router,
    private loadingController: LoadingController
  ) {
    let currentUser = firebase.auth().currentUser.uid;
    firebase.database().ref('/rooms').on('value', snapshot => {
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

  ngOnInit() { }

  async joinRoom(id: any, name: any) {

    const loader = await this.loadingController.create();
    await loader.present();
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/rooms').push({
      roomId: id,
      roomName: name
    })
    .then(data => {
      loader.dismiss();
      this.router.navigate(['/tabs/tab1/roomlist']);
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
