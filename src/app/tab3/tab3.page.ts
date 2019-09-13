import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { AddpopoverComponent } from 'src/app/addpopover/addpopover.component';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  displayName: string;
  photoURL: string;
  email: string;
  constructor() {
    this.displayName = firebase.auth().currentUser.displayName;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.email = firebase.auth().currentUser.email;
  }
}
