import { Injectable } from '@angular/core';


import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import * as firebaseui from 'firebaseui'
const firebaseConfig = {
  apiKey: "AIzaSyCdi_DUL90xrv2ACCad5SNjY9d84iY7j7c",
  authDomain: "hellofirebase-76124.firebaseapp.com",
  databaseURL: "https://hellofirebase-76124.firebaseio.com",
  projectId: "hellofirebase-76124",
  storageBucket: "",
  messagingSenderId: "1025357322276",
  appId: "1:1025357322276:web:d112b29f37746d31ea60b1"
};
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(
    // private loadingController: LoadingController
  ) {
    console.log('websocket service');
  }

  init() {
    firebase.initializeApp(firebaseConfig);
  }

  onAuthStateChanged(callback) {
    firebase.auth().onAuthStateChanged(callback);
  }

  login(user: string, password: string): Promise<any> {

    return firebase.auth().signInWithEmailAndPassword(user, password)
      .then(authData => {
        return authData;
      });
  }

  logout(): Promise<any> {
    return firebase.auth().signOut().then(authData => {
      return authData;
    });
  }

  logginwithgoogle(): Promise<any> {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    return firebase.auth().getRedirectResult().then(function (result) {
      return result;
    });
  }

  async signup(user: string, password: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(user, password)
      .then(authData => {
        return firebase.database().ref('/users/' + authData.user.uid).set({
          displayName: authData.user.displayName,
          photoURL: authData.user.photoURL
        })
          .then(data => {
            return data;
          });
      });
  }

  updateDetailinfo(displayName: string, photoURL: any): Promise<any> {
    return firebase.auth().currentUser.updateProfile({
      'displayName': displayName,
      'photoURL': photoURL
    })
    .then(() => {
      return firebase.database().ref('/users/' + firebase.auth().currentUser.uid).set({
        displayName: displayName,
        photoURL: photoURL
      });
    });
  }

  fileUpload(localfile: File) {
    console.log('ddddddddddd')
  }

  onUsers(callback) {
    let currentUser = firebase.auth().currentUser.uid;
    firebase.database().ref('/users').on('value', callback);
  }

  addfriend(user: any): Promise<any> {

    return firebase.database().ref('/friends/' + firebase.auth().currentUser.uid + '/' + user.key).set({
      uid: user.key
    })
    .then(data => {
      return firebase.database().ref('/friends/' + user.key + '/' + firebase.auth().currentUser.uid).set({
        uid: firebase.auth().currentUser.uid
      })
    });
  }

  create(id: string, name: string, photoURL: any): Promise<any> {
    let db;
    db = firebase.database();
    return db.ref('/rooms/' + id).set({
      name: name,
      photoURL: photoURL
    })
    .then(data => {
      db.ref('/users/' + firebase.auth().currentUser.uid + '/rooms/' + id).set({
        name: name,
        photoURL: photoURL
      })
    });
  }

  onRooms(callback) {
    let currentUser = firebase.auth().currentUser.uid;
    firebase.database().ref('/rooms').on('value', callback);
  }

  joinRoom(room: any): Promise<any> {

    return firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/rooms/' + room.key).set({
      name: room.name,
      photoURL: room.photoURL
    });
  }

  getcurrentUser() {
    let c = firebase.auth().currentUser;
    return {uid: c.uid, displayName: c.displayName, photoURL: c.photoURL, email: c.email};
  }

  onfriendMessage(id: string, callback) {
    let currentUsr = firebase.auth().currentUser.uid;
    let currentUsrphoto = firebase.auth().currentUser.photoURL;
    firebase.database().ref('/friendmessages/' + currentUsr + '/' + id).on('value', callback);
  }

  send(id: string, message: string): Promise<any> {
    let currentUsr = firebase.auth().currentUser.uid;
    const time = new Date();
    return firebase.database().ref('/friendmessages/' + currentUsr +'/' + id).push({
      userId: firebase.auth().currentUser.uid,
      name: firebase.auth().currentUser.email,
      message: message,
      time: time
    })
    .then(data => {
      return firebase.database().ref('/friendmessages/' +  id +'/' + currentUsr).push({
        userId: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.email,
        message: message,
        time: time
      });
    });
  }

  onMessages(id: string, callback) {
    let currentUsr = firebase.auth().currentUser.uid;
    firebase.database().ref('/messages/' + id + '/messageList').on('value', callback);
  }

  roomsend(id: string, message: string): Promise<any> {
    const time = new Date();
    return firebase.database().ref('/messages/' + id + '/messageList').push({
      userId: firebase.auth().currentUser.uid,
      name: firebase.auth().currentUser.email,
      message: message,
      time: time
    });
  }

  onMyRooms(callback) {
    let currentUser = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/rooms').on('value', callback);
  }

  onMyFriends(callback) {
    let currentUser = firebase.auth().currentUser.uid;
    let friendList = [];
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
        friendList = rawList;
        callback(friendList);
      });
    });
  }

  messageNotifications(uid: string, callback) {
    firebase.database().ref('/users/' + uid + '/rooms').on('value', snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        firebase.database().ref('/messages/' + snap.key + '/messageList').on('value', snapshot => {
          let rawList = [];
          callback()
        })
        return false
      });
    });
    firebase.database().ref('/friendmessages/' + uid).on('value', snapshot => {
      callback();
    });
  }
}
