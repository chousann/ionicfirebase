import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-createroom',
  templateUrl: './createroom.component.html',
  styleUrls: ['./createroom.component.scss'],
})
export class CreateroomComponent implements OnInit {
  id: string;
  name: string;
  
  errorFlag: boolean;
  errorMessage: string;
  db: any;
  constructor(
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.db = firebase.database();
    this.errorFlag = false;
    this.errorMessage = '';
  }

  ngOnInit() {}

  async create() {
    const loader = await this.loadingController.create();
    await loader.present();
    this.db.ref('/rooms').push({
      roomId: this.id,
      roomName: this.name
    })
    .then(data => {
      this.db.ref('/users/' + firebase.auth().currentUser.uid + '/rooms' ).push({
        roomId: data.roomId,
        roomName: data.roomName
      })
    })
    .then(data => {
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
