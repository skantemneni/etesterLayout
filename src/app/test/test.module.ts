import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QAModule } from '@qa/qa.module';
// import { AuthModule } from '../auth/auth.module';
import { MaterialUIModule } from '@app/material.module';
import { TestsegmentComponent } from './components/testsegment/testsegment.component';
import { TestsectionComponent } from './components/testsection/testsection.component';
import { SectionAnswerPanelComponent } from './components/section-answer-panel/section-answer-panel.component';
import { TestAnswerPanelComponent } from './components/test-answer-panel/test-answer-panel.component';
import { TestsummaryComponent } from './components/testsummary/testsummary.component';
import { StatsDisplayPanelComponent } from './components/stats-display-panel/stats-display-panel.component';
import { TestlayoutComponent } from './components/testlayout/testlayout.component';
import { TestContainerComponent } from './components/test-container/test-container.component';
import { TestviewComponent } from './components/testview/testview.component';
import { TestHeaderComponent } from './components/test-header/test-header.component';
import { TestFooterComponent } from './components/test-footer/test-footer.component';
import { InnerHtmlRendererComponent } from './util/components/inner-html-renderer/inner-html-renderer.component';
import { EmptyComponentWithMessageComponent } from './util/components/empty-component-with-message/empty-component-with-message.component';

import { TestRoutingModule } from './test-routing.module';


/*
 * Note that although AuthModule is being used from the "Header" component that is currently part of the Test Module, we are
 * including Auth Module in App Module and NOT here in the test module so we can refactor as needed.
 *
 */

@NgModule({
  declarations: [
    TestsegmentComponent,
    TestsectionComponent,
    SectionAnswerPanelComponent,
    TestAnswerPanelComponent,
    TestsummaryComponent,
    StatsDisplayPanelComponent,
    TestlayoutComponent,
    TestContainerComponent,
    TestviewComponent,
    TestHeaderComponent,
    TestFooterComponent,
    InnerHtmlRendererComponent,
    EmptyComponentWithMessageComponent,
 ],
  imports: [
    CommonModule,
    MaterialUIModule,
    QAModule,
//    AuthModule,
    TestRoutingModule
  ]
})
export class TestModule { }
