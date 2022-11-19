import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Test, TestResponse, TestsectionResponse, Testsegment, TestsegmentResponse, Testwithresponse } from '@app/models/etestermodel';
import { AnswerPanelQuestionButtonClickedEvent } from '@app/models/TestConstants';
import { TestQuestionAnsweredEvent } from '@app/models/TestConstants';
import { SectionAnswerPanelComponent } from '@test/components/section-answer-panel/section-answer-panel.component';
import * as TestConstants from '@app/models/TestConstants';
import { ITestEventListener } from '../test-container/test-event-listener.interface';

@Component({
  selector: 'app-test-answer-panel',
  templateUrl: './test-answer-panel.component.html',
  styleUrls: ['./test-answer-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestAnswerPanelComponent implements ITestEventListener, OnInit {

  constructor() { }

  ngOnInit(): void {
  }

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

  // Main input via setter and getter
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
      // Note that testResponse may be unparsable if its in the old format. simply ignore it of thats teh case.
      try {
        this.testResponse = JSON.parse(this._testwithresponse.testResponse);
      } catch (e) {
      }
    }
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


  /**************************************************************************************************************************
   * Interface methods that need to be implemented to react to Test Events
   **************************************************************************************************************************/

  /**
   * Mark the questionProxy on the Test Answer Panel with question status.  First identify the Testsegment-section and the do the job.
   * @param testQuestionAnsweredEvent
   */
  onTestQuestionAnsweredEvent(testQuestionAnsweredEvent: TestQuestionAnsweredEvent) {
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


  /**
   * This gets called when teh Test is Graded.  As art of teh grading process, a full testResponse is freshly created and published.
   * That same response also get saved to persistant storage.
   * @param testResponse - the new TestResponse
   */
  onTestResponseUpdatedEvent(newTestResponse: TestResponse) {
    console.log(`TestAnswerPanelComponent.overwriteTestResponse called with ${JSON.stringify(newTestResponse)}`);
    this.setTestResponse(newTestResponse);

  }
  private setTestResponse(newTestResponse: TestResponse) {
    this.testResponse = newTestResponse;
    // now propogate the section responses to chile components
    for (let testsegmentResponse of newTestResponse.testsegmentResponses) {
      for (let testsectionResponse of testsegmentResponse.testsectionResponses) {
        let filterTestsectionAnswerPanelRenderings: SectionAnswerPanelComponent[] | undefined = this.testsectionAnswerPanelRenderings?.filter(x => x.idTestsegment == testsegmentResponse.idTestsegment && x.testsection.idTestsection == testsectionResponse.idTestsection);
        if (filterTestsectionAnswerPanelRenderings && filterTestsectionAnswerPanelRenderings.length > 0) {
          filterTestsectionAnswerPanelRenderings[0].setTestsectionResponse(testsectionResponse);
        }
      }
    }
  }
  /**************************************************************************************************************************
   * Interface methods that need to be implemented to react to Test Events
   **************************************************************************************************************************/













  /**
  * Perform any actions when invoked. Note that this functions is typically invoked as a result of some Menu Actions (Header -> App -> This)
  * @param action
  */
  performTestRelatedFunction(action: TestConstants.TestActions) {
    console.log(`TestAnswerPanelComponent.performTestRelatedFunction called with: ${action}`);

    this.testsectionAnswerPanelRenderings?.forEach((testsectionAnswerPanelRendering) => {
      //      console.log(testsegmentRendering);
      testsectionAnswerPanelRendering.performTestRelatedFunction(action);
    });

  }


}
