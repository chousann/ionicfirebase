import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrls: ['./addfriend.component.scss'],
})
export class AddfriendComponent implements OnInit {

  public userList: Array<any> = new Array<any>();
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private websocketService: WebsocketService
  ) {
    this.websocketService.onUsers(snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        rawList.push({
          key: snap.key,
          displayName: snap.val().displayName,
          photoURL: snap.val().photoURL
        });
        return false
      });
      this.userList = rawList;
      console.log(this.userList);
    });
  }

  ngOnInit() { }

  async addfriend(user: any) {

    const loader = await this.loadingController.create();
    await loader.present();
    this.websocketService.addfriend(user)
    .then(data => {
      loader.dismiss();
      this.router.navigate(['/tabs/tab2']);
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
