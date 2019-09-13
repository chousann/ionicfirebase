import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-addpopover',
  templateUrl: './addpopover.component.html',
  styleUrls: ['./addpopover.component.scss'],
})
export class AddpopoverComponent implements OnInit {

  @Input() callback: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  async createRoom() {
    // const modal = await this.modalController.create({
    //   component: CreateroomComponent
    // });
    // await modal.present();
    this.callback();
    this.router.navigate(['/createroom']);
  }

  joinRoom() {
    this.callback();
    this.router.navigate(['/joinroom']);
  }

  addFriend() {
    this.callback();
    this.router.navigate(['/addfriend']);
  }

}
