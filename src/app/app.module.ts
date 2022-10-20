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
import { MaterialUIModule } from '../material.module';
/*Import*/
import { MathjaxModule } from "mathjax-angular";

/* BrowserAnimationsModule gets added when you add Andular Materials */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialUIModule,
    NgbModule,
    MathjaxModule.forRoot(/*Optional Config*/
      {
        "config": {
          "loader": {
            "load": ["output/svg", "[tex]/require", "[tex]/ams"]
          },
          "tex": {
            "inlineMath": [["$", "$"]],
            "packages": ["base", "require", "ams"]
          },
          "svg": { "fontCache": "global" }
        },
        "src": "https://cdn.jsdelivr.net/npm/mathjax@3.0.0/es5/startup.js"
      }
    )
  ],
  providers: [],
  bootstrap: [HolygrailgridComponent]
})
export class AppModule { }
