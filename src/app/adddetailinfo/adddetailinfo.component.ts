import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-adddetailinfo',
  templateUrl: './adddetailinfo.component.html',
  styleUrls: ['./adddetailinfo.component.scss'],
})
export class AdddetailinfoComponent implements OnInit {

  displayName: string;

  photoFile: File;
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private websocketService: WebsocketService,
    private zone: NgZone,
    private navController: NavController
  ) { 
    this.displayName = '';
  }

  ngOnInit() {}

  async updateDetailinfo() {
    const loader = await this.loadingController.create();
    await loader.present();
    this.websocketService.updateDetailinfo(this.displayName, this.photoFile)
    .then(() => {
      this.zone.run(() => {
        loader.dismiss();
        this.router.navigate(['/top']);
      })
    })
    .catch(e => {
      loader.dismiss();
      console.log(e);
    });
  }

  filechange(event) {
    this.photoFile = event.target.files[0];
    console.log(this.photoFile);
  }

  back() {
    this.router.navigate(['/top']);
  }
}
