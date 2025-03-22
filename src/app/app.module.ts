import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgDraggableWidgetModule} from '../../projects/ngx-draggable-widget-kama/src/public_api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgDraggableWidgetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
