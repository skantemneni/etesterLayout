import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QAModule } from '../qa/qa.module';
import { MaterialUIModule } from '../../material.module';
import { TestsegmentComponent } from '../components/test/testsegment/testsegment.component';
import { TestsectionComponent } from '../components/test/testsection/testsection.component';
import { SectionAnswerPanelComponent } from '../components/test/section-answer-panel/section-answer-panel.component';
import { TestAnswerPanelComponent } from '../components/test/test-answer-panel/test-answer-panel.component';
import { TestsummaryComponent } from '../components/test/testsummary/testsummary.component';
import { StatsDisplayPanelComponent } from '../components/test/stats-display-panel/stats-display-panel.component';
import { TestlayoutComponent } from '../components/test/testlayout/testlayout.component';
import { TestContainerComponent } from '../components/test/test-container/test-container.component';
import { TestviewComponent } from '../components/test/testview/testview.component';
import { TestHeaderComponent } from '../components/test/test-header/test-header.component';
import { TestFooterComponent } from '../components/test/test-footer/test-footer.component';

import { TestRoutingModule } from './test-routing.module';



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
  ],
  imports: [
    CommonModule,
    MaterialUIModule,
    QAModule,
    TestRoutingModule
  ]
})
export class TestModule { }
