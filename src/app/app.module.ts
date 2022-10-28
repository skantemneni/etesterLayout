import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EtesterdbService } from './services/etesterdb.service';
import { HttpClientModule } from '@angular/common/http';
import { TestModule } from './test/test.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialUIModule } from '../material.module';
import { GlobalService } from './services/global.service';

/* BrowserAnimationsModule gets added when you add Andular Materials */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
],
  imports: [
    BrowserModule,
    TestModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialUIModule,
    NgbModule,
    AppRoutingModule,
  ],
  providers: [EtesterdbService, GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
