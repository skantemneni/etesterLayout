import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EtesterdbService } from './services/etesterdb.service';
import { HttpClientModule } from '@angular/common/http';

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
import { LoginDialogComponent } from './components/auth/login-dialog/login-dialog.component';
import { LogoutDialogComponent } from './components/auth/logout-dialog/logout-dialog.component';
import { GlobalService } from './services//global.service';
import { LoginService } from './components/auth/services/login.service';
import { TestsegmentComponent } from './components/test/testsegment/testsegment.component';
import { TestsectionComponent } from './components/test/testsection/testsection.component';
import { QuestionComponent } from './components/question/question.component';
import { AnswerComponent } from './components/answer/answer.component';
import { SectionAnswerPanelComponent } from './components/test/section-answer-panel/section-answer-panel.component';
import { TestAnswerPanelComponent } from './components/test/test-answer-panel/test-answer-panel.component';
import { TestsummaryComponent } from './components/test/testsummary/testsummary.component';
import { StatsDisplayPanelComponent } from './components/test/stats-display-panel/stats-display-panel.component';

/*Import*/
import { MathjaxModule } from "mathjax-angular";

/* BrowserAnimationsModule gets added when you add Andular Materials */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TestlayoutComponent } from './components/test/testlayout/testlayout.component';
import { TestContainerComponent } from './components/test/test-container/test-container.component';
import { TestviewComponent } from './components/test/testview/testview.component';
import { TestHeaderComponent } from './components/test/test-header/test-header.component';
import { TestFooterComponent } from './components/test/test-footer/test-footer.component';

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
    HolygrailflexComponent,
    TestlayoutComponent,
    TestContainerComponent,
    TestviewComponent,
    TestHeaderComponent,
    TestFooterComponent,
    LoginDialogComponent,
    LogoutDialogComponent,
    QuestionComponent,
    AnswerComponent,
    TestsegmentComponent,
    TestsectionComponent,
    SectionAnswerPanelComponent,
    TestAnswerPanelComponent,
    TestsummaryComponent,
    StatsDisplayPanelComponent,
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
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
  providers: [EtesterdbService, GlobalService, LoginService],
  bootstrap: [TestlayoutComponent]
})
export class AppModule { }
