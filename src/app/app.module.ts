import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EtesterdbService } from './services/etesterdb.service';
import { HttpClientModule } from '@angular/common/http';
import { TestModule } from './test/test.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialUIModule } from '../material.module';
import { LoginDialogComponent } from './components/auth/login-dialog/login-dialog.component';
import { LogoutDialogComponent } from './components/auth/logout-dialog/logout-dialog.component';
import { GlobalService } from './services//global.service';
import { LoginService } from './components/auth/services/login.service';

/* BrowserAnimationsModule gets added when you add Andular Materials */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginDialogComponent,
    LogoutDialogComponent,
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
  providers: [EtesterdbService, GlobalService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
