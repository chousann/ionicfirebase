import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { RoomlistComponent } from './roomlist/roomlist.component';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: RoomlistComponent },
      { path: 'roomlist', component: RoomlistComponent },
      { path: 'tab1', component: Tab1Page }
    ])
  ],
  declarations: [
    Tab1Page,
    RoomlistComponent
  ]
})
export class Tab1PageModule {}
