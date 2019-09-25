import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private router: Router,
    private websocketService: WebsocketService
  ) {
  }

  onclick() {

  }

  onlogout() {
    this.websocketService.logout();
  }

  rooms() {
    this.router.navigate(['/tabs/tab1/roomlist'])
  }

}
