import { Component } from '@angular/core';
import * as firebase from "firebase/app";
import 'firebase/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private router: Router
  ) {
  }

  onclick() {

  }

  onlogout() {
    firebase.auth().signOut();
  }

  rooms() {
    this.router.navigate(['/tabs/tab1/roomlist'])
  }

}
