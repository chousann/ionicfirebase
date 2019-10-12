import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { CreateroomComponent } from '../createroom/createroom.component';
import { WebsocketService } from '../../services/websocket.service';

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
  messageType: boolean;
  localurl: any;
  imageFile: File;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private websocketService: WebsocketService
  ) {
    this.messageType = false;
    this.currentUsr = this.websocketService.getcurrentUser().uid;
    this.currentUsrphoto = this.websocketService.getcurrentUser().photoURL;
    this.id = this.activatedRoute.snapshot.params['id'];
    this.name = this.activatedRoute.snapshot.params['name'];
    this.friendphoto = this.activatedRoute.snapshot.params['photoURL'];
    this.websocketService.onfriendMessage(this.id, snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        rawList.push({
          key: snap.key,
          name: snap.val().name,
          userId: snap.val().userId,
          message: snap.val().message,
          time: snap.val().time,
          type: snap.val().type,
          imageURL: snap.val().imageURL
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
    this.websocketService.send(this.id, this.message)
      .then((newMessage) => {
        this.message = '';
      })
      .catch(e => {
        console.log(e);
      });
  }

  back() {
    this.router.navigate(['/tabs/tab1/roomlist']);
  }

  othermeaage() {
    this.messageType = !this.messageType;
  }

  filechange(event) {
    this.imageFile = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.localurl = reader.result;
    }
  }

  sendimage() {
    this.websocketService.sendimage(this.id, this.imageFile)
      .then((newMessage) => {
        this.message = '';
      })
      .catch(e => {
        console.log(e);
      });
  }
}
