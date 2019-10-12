import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';

// import AV from 'leancloud-storage/dist/av-weapp.js';
import * as AV from 'leancloud-storage';
import 'leancloud-storage/live-query';
import { Realtime, IMClient, TextMessage, Event, TypedMessage } from 'leancloud-realtime';
import { ImageMessage } from 'leancloud-realtime-plugin-typed-messages';
import { Subscription } from 'rxjs';
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

class firebasemessage {
  public type: number;
  public key: string;
  public name: string;
  public userId: string;
  public message: string;
  public time: any;
  public imageURL: string;
  val() {
    return this;
  }
}
class firebaseuser {
  public key: string;
  public displayName: string;
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

  eventEmitter: EventEmitter<any> = new EventEmitter<any>();
  call: any;
  messageList: Array<any> = new Array<any>();
  subscription: Subscription
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
    this.call = callback;
    this.realtime.createIMClient(currentUser).then(client => {
      this.iMClient = client;
      callback(currentUser);
    }, error => {
      callback(null);
    });
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
      this.call(null);
      return authdata;
    });
  }

  logginwithgoogle(): Promise<any> {
    // let provider = new firebase.auth.GoogleAuthProvider();
    // firebase.auth().signInWithRedirect(provider);
    // return firebase.auth().getRedirectResult().then(function (result) {
    //   return result;
    // });
    return;
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
      this.realtime.createIMClient(userdata).then(client => {
        return this.iMClient = client;
      });
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

  updateDetailinfo(displayName: string, photoURL: File): Promise<any> {

    let currentUser = AV.User.current();
    let file = new AV.File(photoURL.name, photoURL);
    currentUser.set('username', displayName);
    currentUser.set('avatar', file);
    return currentUser.save().then(userdata => {
      var query = new AV.Query('user');
      query.get(userdata.get('uid')).then(querydata => {
        querydata.set('displayName', displayName);
        querydata.set('avatar', file);
        querydata.save();
      });
    });
  }

  fileUpload(localfile: File): Promise<any> {
    let file = new AV.File(localfile.name, localfile);
    return file.save();
  }

  onUsers(callback) {
    let query = new AV.Query('user');
    query.find().then(querydata => {
      let to = new tofirebase();
      let rawList = [];
      querydata.forEach(snap => {
        let to = new firebaseuser();
        to.key = snap.id;
        to.displayName = snap.get('displayName');
        to.photoURL = snap.get('avatar').url();
        rawList.push(to);
        return false;
      });
      this.ngZone.run(() => {
        callback(rawList);
      });

    });
  }

  addfriend(user: any): Promise<any> {

    let query = new AV.Query('user');
    return query.get(user.key).then(querydata => {
      return this.iMClient.createConversation({
        members: [querydata.get('uid')]
      }).then(conversation => {
        let currentUser = AV.User.current();
        let u = AV.Object.createWithoutData('user', currentUser.get('uid'));
        u.addUnique('friends', [{
          conversation: conversation.id,
          friend: user.key,
          name: user.displayName,
          photoURL: user.photoURL
        }]);
        return u.save().then(() => {
          let u1 = AV.Object.createWithoutData('user', user.key);
          u1.addUnique('friends', [{
            conversation: conversation.id,
            friend: currentUser.get('uid'),
            name: currentUser.getUsername(),
            photoURL: currentUser.get('avatar').url()
          }]);
          return u1.save();
        });
      });
    });
  }

  create(id: string, name: string, photoURL: File): Promise<any> {

    return this.fileUpload(photoURL).then(file => {
      return this.iMClient.createConversation({
        members: [],
        // 对话名称
        name: name,
        photoURL: file.url(),
      }).then(conversation => {
        let currentUser = AV.User.current();
        let user = AV.Object.createWithoutData('user', currentUser.get('uid'));
        user.addUnique('rooms', [{
          id: conversation.id,
          name: conversation.get('name'),
          photoURL: conversation.get('photoURL')
        }]);
        return user.save();
      });
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
      to.key = room.key;
      to.name = room.name;
      to.photoURL = room.photoURL;
      user.addUnique('rooms', [{
        id: room.key,
        name: room.name,
        photoURL: room.photoURL
      }]);
      return user.save();
    });
  }

  getcurrentUser() {
    let currentUser = AV.User.current();
    return { uid: currentUser.id, displayName: currentUser.getUsername(), photoURL: currentUser.get('avatar').url(), email: currentUser.getEmail() };
  }

  json_array(data) {
    let len = eval(data).length;
    let arr = [];
    for (var i = 0; i < len; i++) {
      let fm = new firebasemessage();
      fm.key = data[i].key;
      fm.name = data[i].name;
      fm.userId = data[i].userId;
      fm.time = data[i].time;
      fm.message = data[i].message;
      fm.type = data[i].type;
      fm.imageURL = data[i].imageURL;
      arr.push(fm);
    }
    return arr;
  }

  onfriendMessage(id: string, callback) {

    // 当前用户收到了某一条消息，可以通过响应 Event.MESSAGE 这一事件来处理。
    let json = localStorage.getItem(AV.User.current().id + id);
    if (!json) {
      let data = [];
      localStorage.setItem(AV.User.current().id + id, JSON.stringify(data));
      json = localStorage.getItem(AV.User.current().id + id);
    }
    let jsonObj = JSON.parse(json);
    callback(this.json_array(jsonObj));

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.eventEmitter.subscribe((data) => {
      let json = localStorage.getItem(AV.User.current().id + id);
      let jsonObj = JSON.parse(json);
      this.ngZone.run(() => {
        callback(this.json_array(jsonObj));
      });
    });
  }

  send(id: string, message: string): Promise<any> {

    return this.iMClient.getConversation(id).then((conversation) => {
      this.ngZone.run(() => {
        return conversation.send(new TextMessage(message)).then((m) => {
          let json = localStorage.getItem(AV.User.current().id + conversation.id);
          let jsonObj = JSON.parse(json);
          let fm = new firebasemessage();
          fm.key = m.id;
          fm.name = m.from;
          fm.userId = m.from;
          fm.time = m.timestamp;
          fm.type = -1;
          fm.message = m.text;
          jsonObj.push(fm);
          localStorage.setItem(AV.User.current().id + conversation.id, JSON.stringify(jsonObj));
          this.eventEmitter.emit({
            m: m
          });
        });
      })
    });
  }

  sendimage(id: string, image: File): Promise<any> {

    return this.iMClient.getConversation(id).then((conversation) => {
      let file = new AV.File(image.name, image);
      return file.save().then(() => {
        let message = new ImageMessage(file);
        message.setText('10/10');
        message.setAttributes({ location: '旧金山' });
        this.ngZone.run(() => {
          return conversation.send(message).then((m) => {
            let json = localStorage.getItem(AV.User.current().id + conversation.id);
            let jsonObj = JSON.parse(json);
            let fm = new firebasemessage();
            fm.key = m.id;
            fm.name = m.from;
            fm.userId = m.from;
            fm.time = m.timestamp;
            fm.type = -2;
            fm.imageURL = message._file.url();
            jsonObj.push(fm);
            localStorage.setItem(AV.User.current().id + conversation.id, JSON.stringify(jsonObj));
            this.eventEmitter.emit({
              m: m
            });
          });
        });
      })
    });
  }

  onMessages(id: string, callback) {
    this.onfriendMessage(id, callback);
  }

  roomsend(id: string, message: string): Promise<any> {
    return this.send(id, message);
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

    let query = new AV.Query('user');
    query.get(AV.User.current().get('uid')).then(querydata => {
      let friends = querydata.get('friends');
      let rawList = [];
      friends.forEach(snap => {
        let to = new tofirebase();
        to.key = snap.conversation;
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

  messageNotifications(uid: string, callback) {

    this.iMClient.on(Event.INVITED, function invitedEventHandler(payload, conversation) {
      console.log(payload.invitedBy, conversation.id);
      callback();
    });

    // 当前用户收到了某一条消息，可以通过响应 Event.MESSAGE 这一事件来处理。
    this.iMClient.on(Event.MESSAGE, (message: ImageMessage, conversation) => {
      console.log('收到新消息：' + message.text);
      let json = localStorage.getItem(AV.User.current().id + conversation.id);
      if (!json) {
        let data = [];
        localStorage.setItem(AV.User.current().id + conversation.id, JSON.stringify(data));
        json = localStorage.getItem(AV.User.current().id + conversation.id);
      }
      let jsonObj = JSON.parse(json);
      let fm = new firebasemessage();
      fm.key = message.id;
      fm.name = message.from;
      fm.userId = message.from;
      fm.time = message.timestamp;
      switch (message.content._lctype) {
        case TextMessage.TYPE:
          fm.type = -1;
          fm.message = message.text;
          break;
        case ImageMessage.TYPE:
          fm.type = -2;
          fm.imageURL = message.content._lcfile.url;
          break;
        default:
          console.warn('收到未知类型消息');
      }
      jsonObj.push(fm);
      localStorage.setItem(AV.User.current().id + conversation.id, JSON.stringify(jsonObj));
      this.messageList.push(fm);
      this.eventEmitter.emit({
        m: message
      });
      callback();
    });
  }
}
