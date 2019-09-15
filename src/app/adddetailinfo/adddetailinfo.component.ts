import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-adddetailinfo',
  templateUrl: './adddetailinfo.component.html',
  styleUrls: ['./adddetailinfo.component.scss'],
})
export class AdddetailinfoComponent implements OnInit {

  displayName: string;
  photoURL: string;
  constructor(
    private router: Router,
    private loadingController: LoadingController
  ) { 
    this.displayName = '';
    this.photoURL = '';
  }

  ngOnInit() {}

  async updateDetailinfo() {
    const loader = await this.loadingController.create();
    await loader.present();
    firebase.auth().currentUser.updateProfile({
      'displayName': this.displayName,
      'photoURL': this.photoURL
    })
    .then(() => {
      firebase.database().ref('/users/' + firebase.auth().currentUser.uid).set({
        displayName: this.displayName,
        photoURL: this.photoURL
      });
    })
    .then(() => {
      loader.dismiss();
      this.router.navigate(['/top']);
    })
    .catch(e => {
      loader.dismiss();
      console.log(e);
    });
  }

}
