import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { CreateroomComponent } from '../createroom/createroom.component';
@Component({
  selector: 'app-privateroom',
  templateUrl: './privateroom.component.html',
  styleUrls: ['./privateroom.component.scss'],
})
export class PrivateroomComponent implements OnInit {


  id: string;
  name: string;

  message: string;

  messageList: Array<any> = new Array<any>();
  currentUsr: string;
  currentUsrphoto: string;
  friendphoto: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.currentUsr = firebase.auth().currentUser.uid;
    this.currentUsrphoto = firebase.auth().currentUser.photoURL;
    this.id = this.activatedRoute.snapshot.params['id'];
    this.name = this.activatedRoute.snapshot.params['name'];
    this.friendphoto = this.activatedRoute.snapshot.params['photoURL'];
    firebase.database().ref('/friendmessages/' + this.currentUsr + '/' + this.id).on('value', snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        rawList.push({
          key: snap.key,
          name: snap.val().name,
          userId: snap.val().userId,
          message: snap.val().message,
          time: snap.val().time
        });
        return false
      });
      this.messageList = rawList;
      console.log(this.messageList);
    });
  }

  ngOnInit() { }

  send() {
    const time = new Date();
    firebase.database().ref('/friendmessages/' + this.currentUsr +'/' + this.id).push({
      userId: firebase.auth().currentUser.uid,
      name: firebase.auth().currentUser.email,
      message: this.message,
      time: time
    })
    .then(data => {
      firebase.database().ref('/friendmessages/' +  this.id +'/' + this.currentUsr).push({
        userId: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.email,
        message: this.message,
        time: time
      })
      .then((newMessage) => {
        this.message = '';
      })
    })
    .catch(e => {
      console.log(e);
    });
  }

  back() {
    this.router.navigate(['/tabs/tab1/roomlist']);
  }
}
