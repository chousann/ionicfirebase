import { Injectable, NgZone } from '@angular/core';


import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import * as firebaseui from 'firebaseui'
import { WebsocketService } from '../services/websocket.service';

// import AV from 'leancloud-storage/dist/av-weapp.js';
import * as AV from 'leancloud-storage/live-query';
import { Realtime, IMClient, TextMessage, Event } from 'leancloud-realtime';
const leanCloudConfig = {
  appId: "JQaGq03cPclsQLMx4tTGrfAX-MdYXbMMI",
  appKey: "I4P0r5JDqsa1KD0siMAASDjO"
};
class tofirebase {
  public key: string;
  public name: string;
  public photoURL: string;

  val() {
    return this;
  }
}
@Injectable({
  providedIn: 'root'
})
export class LeanCloudWebsocketService extends WebsocketService {

  realtime = new Realtime(leanCloudConfig);
  iMClient: IMClient;
  constructor(
    private ngZone: NgZone
  ) {
    super();
    console.log('hello lean cloud');
    this.init();
  }

  init() {
    AV.init(leanCloudConfig);
  }

  onAuthStateChanged(callback) {
    var currentUser = AV.User.current();
    callback(currentUser);
  }

  login(user: string, password: string): Promise<any> {

    return AV.User.logIn(user, password).then(authdata => {
      // 登录成功
      return authdata;
    }).then(data => {
      return this.realtime.createIMClient(data).then(client => {
        return this.iMClient = client;
      });
    });
  }

  logout(): Promise<any> {
    return AV.User.logOut().then(authdata => {
      // 登录成功
      return authdata;
    });
  }

  logginwithgoogle(): Promise<any> {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    return firebase.auth().getRedirectResult().then(function (result) {
      return result;
    });
  }

  async signup(email: string, password: string): Promise<any> {

    // 创建实例
    let user = new AV.User();

    // 等同于 user.set('username', 'Tom')
    user.setUsername(email);
    user.setPassword(password);

    // 可选
    user.setEmail(email);
    // user.setMobilePhoneNumber('+8618200008888');

    // 设置其他属性的方法跟 AV.Object 一样
    user.set('photoURL', '');

    return user.signUp().then(userdata => {
      // 注册成功
      console.log('注册成功。objectId：' + userdata.id);
      let u = new AV.Object('user');
      u.set('uid', userdata.id);
      u.set('displayName', userdata.getUsername());
      u.set('photoURL', userdata.get('photoURL'));
      return u.save().then(data => {
        return data;
      }).then(result => {
        userdata.set('uid', result.id);
        return userdata.save();
      })
    });
  }

  updateDetailinfo(displayName: string, photoURL: string): Promise<any> {

    let currentUser = AV.User.current();

    currentUser.set('username', displayName);
    currentUser.set('photoURL', photoURL);
    return currentUser.save().then(userdata => {
      var query = new AV.Query('user');
      query.get(userdata.get('uid')).then(querydata => {
        querydata.set('displayName', displayName);
        querydata.set('photoURL', photoURL);
        querydata.save();
      });
    });
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

  create(id: string, name: string, photoURL: string): Promise<any> {
    return this.iMClient.createConversation({
      members: [],
      // 对话名称
      name: name,
      photoURL: photoURL,
    }).then(conversation => {
      let currentUser = AV.User.current();
      let user = AV.Object.createWithoutData('user', currentUser.get('uid'));
      let to = new tofirebase();
      to.key = conversation.id;
      to.name = conversation.get('name');
      to.photoURL = conversation.get('photoURL');
      user.addUnique('rooms', [to]);
      return user.save();
    });
  }

  onRooms(callback) {
    let query = new AV.Query('_Conversation');
    query.find().then(querydata => {
      let to = new tofirebase();
      let rawList = [];
      querydata.forEach(snap => {
        let to = new tofirebase();
        to.key = snap.id;
        to.name = snap.get('name');
        to.photoURL = snap.get('photoURL');
        rawList.push(to);
        return false
      });
      this.ngZone.run(() => {
        callback(rawList);
      });

    })
  }

  joinRoom(room: any): Promise<any> {
    return this.iMClient.getConversation(room.key).then((conversation) => {
      conversation.join();
      let currentUser = AV.User.current();
      let user = AV.Object.createWithoutData('user', currentUser.get('uid'));
      let to = new tofirebase();
      to.key = room.id;
      to.name = room.name;
      to.photoURL = room.photoURL;
      user.addUnique('rooms', [to]);
      return user.save();
    });
  }

  getcurrentUser() {
    let currentUser = AV.User.current();
    return { uid: currentUser.id, displayName: '', photoURL: '', email: '' };
  }

  onfriendMessage(id: string, callback) {
    let currentUsr = firebase.auth().currentUser.uid;
    let currentUsrphoto = firebase.auth().currentUser.photoURL;
    firebase.database().ref('/friendmessages/' + currentUsr + '/' + id).on('value', callback);
  }

  send(id: string, message: string): Promise<any> {
    let currentUsr = firebase.auth().currentUser.uid;
    const time = new Date();
    return firebase.database().ref('/friendmessages/' + currentUsr + '/' + id).push({
      userId: firebase.auth().currentUser.uid,
      name: firebase.auth().currentUser.email,
      message: message,
      time: time
    })
      .then(data => {
        return firebase.database().ref('/friendmessages/' + id + '/' + currentUsr).push({
          userId: firebase.auth().currentUser.uid,
          name: firebase.auth().currentUser.email,
          message: message,
          time: time
        });
      });
  }

  onMessages(id: string, callback) {
    // 当前用户收到了某一条消息，可以通过响应 Event.MESSAGE 这一事件来处理。

    this.iMClient.on(Event.MESSAGE, (message, conversation) => {
      if (conversation.id === id) {
        console.log('收到新消息：' + message);
        callback([]);
      }
    });
  }

  roomsend(id: string, message: string): Promise<any> {

    return this.iMClient.getConversation(id).then((conversation) => {
      return conversation.send(new TextMessage(message));
    });
  }

  onMyRooms(callback) {
    let query = new AV.Query('user');
    query.get(AV.User.current().get('uid')).then(querydata => {
      let rooms = querydata.get('rooms');
      let rawList = [];
      rooms.forEach(snap => {
        let to = new tofirebase();
        to.key = snap.id;
        to.name = snap.name;
        to.photoURL = snap.photoURL;
        rawList.push(to);
        return false
      });
      this.ngZone.run(() => {
        callback(rawList);
      });
    });
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
    callback();
  }
}
