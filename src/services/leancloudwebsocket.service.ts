import { Injectable, NgZone, EventEmitter } from '@angular/core';
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

class firebasemessage {
  public key: string;
  public name: string;
  public userId: string;
  public message: string;
  public time: any;
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
    let query = new AV.Query('user');
    query.find().then(querydata => {
      let to = new tofirebase();
      let rawList = [];
      querydata.forEach(snap => {
        let to = new firebaseuser();
        to.key = snap.id;
        to.displayName = snap.get('displayName');
        to.photoURL = snap.get('photoURL');
        rawList.push(to);
        return false
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
            photoURL: currentUser.get('photoURL')
          }]);
          return u1.save();
        });
      });
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
      user.addUnique('rooms', [{
        id: conversation.id,
        name: conversation.get('name'),
        photoURL: conversation.get('photoURL')
      }]);
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
    return { uid: currentUser.id, displayName: currentUser.getUsername(), photoURL: currentUser.get('photoURL'), email: currentUser.getEmail() };
  }

  onfriendMessage(id: string, callback) {

    // 当前用户收到了某一条消息，可以通过响应 Event.MESSAGE 这一事件来处理。

    this.iMClient.getConversation(id).then((conversation) => {
      conversation.queryMessages({ limit: 100, type: TextMessage.TYPE }).then(messages => {
        let rawList = [];
        messages.forEach((message: TextMessage) => {
          let fm = new firebasemessage();
          fm.key = message.id;
          fm.name = message.from;
          fm.message = message.text;
          fm.userId = message.from;
          fm.time = message.timestamp;
          rawList.push(fm);
          return false
        });
        this.ngZone.run(() => {
          callback(rawList);
        });
      });
    });

    this.iMClient.on(Event.MESSAGE, (message: TextMessage, conversation) => {
      console.log('收到新消息：' + message.text);
      if (conversation.id === id) {
        console.log('收到新消息：' + message);
        conversation.queryMessages({ limit: 100, type: TextMessage.TYPE }).then(messages => {
          let rawList = [];
          messages.forEach((message: TextMessage) => {
            let fm = new firebasemessage();
            fm.key = message.id;
            fm.name = message.from;
            fm.message = message.text;
            fm.userId = message.from;
            fm.time = message.timestamp;
            rawList.push(fm);
            return false
          });
          this.ngZone.run(() => {
            callback(rawList);
          });
        });
      }
    });

    this.iMClient.on(Event.UNREAD_MESSAGES_COUNT_UPDATE, (conversations) => {
      for (let conv of conversations) {
        if (conv.id === id) {
          console.log(conv.id, conv.name, conv.unreadMessagesCount);
          conv.queryMessages({ limit: 100, type: TextMessage.TYPE }).then(messages => {
            let rawList = [];
            messages.forEach((message: TextMessage) => {
              let fm = new firebasemessage();
              fm.key = message.id;
              fm.name = message.from;
              fm.message = message.text;
              fm.userId = message.from;
              fm.time = message.timestamp;
              rawList.push(fm);
              return false
            });
            this.ngZone.run(() => {
              callback(rawList);
            });
          });
        }
      }
    });

    this.eventEmitter.subscribe((data) => {
      data.conversation.queryMessages({ limit: 100, type: TextMessage.TYPE }).then(messages => {
        let rawList = [];
        messages.forEach((message: TextMessage) => {
          let fm = new firebasemessage();
          fm.key = message.id;
          fm.name = message.from;
          fm.message = message.text;
          fm.userId = message.from;
          fm.time = message.timestamp;
          rawList.push(fm);
          return false
        });
        this.ngZone.run(() => {
          callback(rawList);
        });
      });
    });
  }

  send(id: string, message: string): Promise<any> {

    return this.iMClient.getConversation(id).then((conversation) => {
      this.ngZone.run(() => {
        return conversation.send(new TextMessage(message)).then((m) => {
          this.eventEmitter.emit({
            conversation: conversation
          });
        });
      })
    });
  }

  onMessages(id: string, callback) {
    // 当前用户收到了某一条消息，可以通过响应 Event.MESSAGE 这一事件来处理。

    this.iMClient.getConversation(id).then((conversation) => {
      conversation.queryMessages({ limit: 100, type: TextMessage.TYPE }).then(messages => {
        let rawList = [];
        messages.forEach((message: TextMessage) => {
          let fm = new firebasemessage();
          fm.key = message.id;
          fm.name = message.from;
          fm.message = message.text;
          fm.userId = message.from;
          fm.time = message.timestamp;
          rawList.push(fm);
          return false
        });
        this.ngZone.run(() => {
          callback(rawList);
        });
      });
    });

    this.iMClient.on(Event.MESSAGE, (message: TextMessage, conversation) => {
      console.log('收到新消息：' + message.text);
      if (conversation.id === id) {
        console.log('收到新消息：' + message);
        conversation.queryMessages({ limit: 100, type: TextMessage.TYPE }).then(messages => {
          let rawList = [];
          messages.forEach((message: TextMessage) => {
            let fm = new firebasemessage();
            fm.key = message.id;
            fm.name = message.from;
            fm.message = message.text;
            fm.userId = message.from;
            fm.time = message.timestamp;
            rawList.push(fm);
            return false
          });
          this.ngZone.run(() => {
            callback(rawList);
          });
        });
      }
    });

    this.iMClient.on(Event.UNREAD_MESSAGES_COUNT_UPDATE, (conversations) => {
      for (let conv of conversations) {
        if (conv.id === id) {
          console.log(conv.id, conv.name, conv.unreadMessagesCount);
          conv.queryMessages({ limit: 100, type: TextMessage.TYPE }).then(messages => {
            let rawList = [];
            messages.forEach((message: TextMessage) => {
              let fm = new firebasemessage();
              fm.key = message.id;
              fm.name = message.from;
              fm.message = message.text;
              fm.userId = message.from;
              fm.time = message.timestamp;
              rawList.push(fm);
              return false
            });
            this.ngZone.run(() => {
              callback(rawList);
            });
          });
        }
      }
    });

    this.eventEmitter.subscribe((data) => {
      data.conversation.queryMessages({ limit: 100, type: TextMessage.TYPE }).then(messages => {
        let rawList = [];
        messages.forEach((message: TextMessage) => {
          let fm = new firebasemessage();
          fm.key = message.id;
          fm.name = message.from;
          fm.message = message.text;
          fm.userId = message.from;
          fm.time = message.timestamp;
          rawList.push(fm);
          return false
        });
        this.ngZone.run(() => {
          callback(rawList);
        });
      });
    });
  }

  roomsend(id: string, message: string): Promise<any> {

    return this.iMClient.getConversation(id).then((conversation) => {
      this.ngZone.run(() => {
        return conversation.send(new TextMessage(message)).then((m) => {
          this.eventEmitter.emit({
            conversation: conversation
          });
        });
      })
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
    callback();
  }
}
