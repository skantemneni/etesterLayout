import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Test, TestResponse, TestsectionResponse, Testsegment, TestsegmentResponse, Testwithresponse } from '@app/models/etestermodel';
import { AnswerPanelQuestionButtonClickedEvent } from '@app/models/TestConstants';
import { TestQuestionAnsweredEvent } from '@app/models/TestConstants';
import { SectionAnswerPanelComponent } from '@test/components/section-answer-panel/section-answer-panel.component';

@Component({
  selector: 'app-test-answer-panel',
  templateUrl: './test-answer-panel.component.html',
  styleUrls: ['./test-answer-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestAnswerPanelComponent implements OnInit {

  @Output() answerPanelQuestionButtonClicked = new EventEmitter<AnswerPanelQuestionButtonClickedEvent>();

  // View Children that allows to communicate-to/invoke-action-on children view elements as needed
  @ViewChildren('testsectionAnswerPanelRendering') testsectionAnswerPanelRenderings: QueryList<SectionAnswerPanelComponent> | undefined;

  @Input() displayableName: string = "IIT Mains Test 100";
  testResponse?: TestResponse | undefined = undefined;
  test?: Test | undefined = undefined;

/*  private _test?: Test | undefined = undefined;
  @Input()
  public get test(): Test | undefined {
    return this._test;
  }
  public set test(test: Test | undefined) {
    this._test = test;
  }

  private _testResponse?: TestResponse | undefined = undefined;
  @Input()
  public get testResponse(): TestResponse | undefined {
    return this._testResponse;
  }
  public set testResponse(testResponse: TestResponse | undefined) {
    this._testResponse = testResponse;
  }
*/
  private _testwithresponse?: Testwithresponse | undefined = undefined;
  @Input()
  public get testwithresponse(): Testwithresponse | undefined {
    return this._testwithresponse;
  }
  public set testwithresponse(testwithresponse: Testwithresponse | undefined) {
    console.log(`TestAnswerPanelComponent.setTestwithresponse: ${testwithresponse}`)
    this._testwithresponse = testwithresponse;
    this.test = this._testwithresponse?.test;
    if (this._testwithresponse?.testResponse != null) {
      this.testResponse = JSON.parse(this._testwithresponse.testResponse);
    }
  }

  public setTestResponse(testResponse: TestResponse) {
    this.testResponse = testResponse;
    // now propogate the section responses to chile components
    for (let testsegmentResponse of testResponse.testsegmentResponses) {
      for (let testsectionResponse of testsegmentResponse.testsectionResponses) {
        let filterTestsectionAnswerPanelRenderings: SectionAnswerPanelComponent[] | undefined = this.testsectionAnswerPanelRenderings?.filter(x => x.idTestsegment == testsegmentResponse.idTestsegment && x.testsection.idTestsection == testsectionResponse.idTestsection);
        if (filterTestsectionAnswerPanelRenderings && filterTestsectionAnswerPanelRenderings.length > 0) {
          filterTestsectionAnswerPanelRenderings[0].setTestsectionResponse(testsectionResponse);
        }
      }
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

  answerItemClicked(event: AnswerPanelQuestionButtonClickedEvent): void {
    console.log(`TestAnswerPanelComponent.answerItemClicked: ${event}`)
    console.log(`TestAnswerPanelComponent.answerItemClicked: ${JSON.stringify(event)}`)
    this.answerPanelQuestionButtonClicked.emit(event);
  }

  /**
   *  Note that this is an important way to identify which TestsegmentResponse applies to which Testsegment.  This can return an undefined if the Testsegment has no previously saved response.
   * @param testsegment: Testsegment
   * @return TestsegmentResponse type
   */
  getInitialTestsectionResponseForTestsection(idTestsegment: string, idTestsection: string): TestsectionResponse | undefined {
    let filterSegmentResults: TestsegmentResponse[] | undefined = this.testResponse?.testsegmentResponses.filter(x => x.idTestsegment == idTestsegment);
    if (filterSegmentResults && filterSegmentResults.length > 0) {
      let filterSectionResults: TestsectionResponse[] | undefined = filterSegmentResults[0].testsectionResponses.filter(y => y.idTestsection == idTestsection);
      if (filterSectionResults && filterSectionResults.length > 0) {
        return filterSectionResults[0];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  /**
   * Mark the questionProxy on the Test Answer Panel with question status.  First identify the Testsegment-section and the do the job.
   * @param testQuestionAnsweredEvent
   */
  renderQuestionStatus(testQuestionAnsweredEvent: TestQuestionAnsweredEvent) {
    // find the correct SectionAnswerPanelComponent and pass onteh message
    // reduce to the right testsection
    let filterResults: SectionAnswerPanelComponent[] | undefined = this.testsectionAnswerPanelRenderings?.filter(x => x.testsection?.idTestsection == testQuestionAnsweredEvent.idTestsection && x.idTestsegment == testQuestionAnsweredEvent.idTestsegment);
    if (filterResults && filterResults.length > 0) {
      console.log(`TestAnswerPanelComponent: renderQuestionStatus: ${JSON.stringify(testQuestionAnsweredEvent)}`);
      filterResults[0].renderQuestionStatus(testQuestionAnsweredEvent);
    } else {
      console.log(`TestAnswerPanelComponent: Some Effed up. Count not find the Appropriate Section for: ${JSON.stringify(testQuestionAnsweredEvent)}`);
    }
    return;
  }


}
