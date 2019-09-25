import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-joinroom',
  templateUrl: './joinroom.component.html',
  styleUrls: ['./joinroom.component.scss'],
})
export class JoinroomComponent implements OnInit {
  public roomList: Array<any> = new Array<any>();
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private websocketService: WebsocketService
  ) {
    this.websocketService.onRooms(snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        rawList.push({
          key: snap.key,
          name: snap.val().name,
          photoURL: snap.val().photoURL
        });
        return false
      });
      this.roomList = rawList;
      console.log(this.roomList);
    });
  }

  ngOnInit() { }

  async joinRoom(room: any) {

    const loader = await this.loadingController.create();
    await loader.present();
    this.websocketService.joinRoom(room)
    .then(data => {
      loader.dismiss();
      this.router.navigate(['/tabs/tab1/roomlist']);
    })
    .catch(e => {
      console.log(e);
      loader.dismiss();
    });
  }

  back() {
    this.router.navigate(['/tabs/tab1/roomlist']);
  }

}
