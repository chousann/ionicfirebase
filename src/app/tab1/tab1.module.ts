import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { RoomComponent } from './room/room.component';
import { RoomlistComponent } from './roomlist/roomlist.component';
import { CreateroomComponent } from './createroom/createroom.component';
import { JoinroomComponent } from './joinroom/joinroom.component';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: Tab1Page },
      { path: 'roomlist', component: RoomlistComponent },
      { path: 'room', component: RoomComponent },
      { path: 'tab1', component: Tab1Page },
      { path: 'createroom', component: CreateroomComponent },
      { path: 'joinroom', component: JoinroomComponent }
    ])
  ],
  declarations: [
    Tab1Page,
    RoomComponent,
    RoomlistComponent,
    CreateroomComponent,
    JoinroomComponent
  ]
})
export class Tab1PageModule {}
