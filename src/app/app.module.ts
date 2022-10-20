import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/hg/header/header.component';
import { NavComponent } from './components/layout/hg/nav/nav.component';
import { MainComponent } from './components/layout/hg/main/main.component';
import { AsideComponent } from './components/layout/hg/aside/aside.component';
import { FooterComponent } from './components/layout/hg/footer/footer.component';
import { PrivacyPolicyComponent } from './components/layout/hg/privacy-policy/privacy-policy.component';
import { HolygrailgridComponent } from './components/layout/holygrailgrid/holygrailgrid.component';
import { HolygrailflexComponent } from './components/layout/holygrailflex/holygrailflex.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavComponent,
    MainComponent,
    AsideComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    HolygrailgridComponent,
    HolygrailflexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [HolygrailgridComponent]
})
export class AppModule { }
