import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { CreateroomComponent } from '../createroom/createroom.component';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {

  id: string;
  name: string;

  message: string;

  messageList: Array<any> = new Array<any>();
  currentUsr: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private websocketService: WebsocketService
  ) {
    this.currentUsr = this.websocketService.getcurrentUser().uid;
    this.id = this.activatedRoute.snapshot.params['id'];
    this.name = this.activatedRoute.snapshot.params['name'];
    this.websocketService.onMessages(this.id, snapshot => {
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
    this.websocketService.roomsend(this.id, this.message).then((newMessage) => {
      this.message = '';
    })
      .catch(e => {
        console.log(e);
      });
  }

  back() {
    this.router.navigate(['/tabs/tab1/roomlist']);
  }

}
