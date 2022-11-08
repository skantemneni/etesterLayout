import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ResponseDetails, Test, TestResponse, TestsectionResponse, TestsegmentResponse, Testwithresponse } from '@app/models/etestermodel';
import { StatsDisplayPanelComponent } from '@test/components/stats-display-panel/stats-display-panel.component';
import * as TestConstants from '@app/models/TestConstants';
import { ITestEventListener } from '../test-container/test-event-listener.interface';

@Component({
  selector: 'app-testsummary',
  templateUrl: './testsummary.component.html',
  styleUrls: ['./testsummary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestsummaryComponent implements ITestEventListener, OnInit {

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  /*
   * Local Variables 
   */
  displayableTestName: string = "Test";
  totalQuestionCount = 0;
  totalPointCount = 0;
  responseDetails?: ResponseDetails;
  answeredCount = 0;
  answeredPoints = 0;
  correctCount = 0;
  correctPoints = 0;

  // View Children that allows to communicate-to/invoke-action-on children view elements as needed
  @ViewChild('testStatsDisplayPanel') testStatsDisplayPanelRendering!: StatsDisplayPanelComponent;
  @ViewChildren('sectionStatsDisplayPanel') sectionStatsDisplayPanelRenderings: QueryList<StatsDisplayPanelComponent> | undefined;

  // testResponseStats: ResponseDetails | undefined = undefined;


  testResponse?: TestResponse | undefined = undefined;
  test?: Test | undefined = undefined;
  private _testwithresponse?: Testwithresponse | undefined = undefined;
  @Input()
  public get testwithresponse(): Testwithresponse | undefined {
    return this._testwithresponse;
  }
  public set testwithresponse(testwithresponse: Testwithresponse | undefined) {
    console.log(`TestsummaryComponent.setTestwithresponse: ${testwithresponse}`)
    this._testwithresponse = testwithresponse;
    this.test = this._testwithresponse?.test;
    if (this._testwithresponse?.testResponse != null) {
      this.testResponse = JSON.parse(this._testwithresponse.testResponse);
      this.responseDetails = this.testResponse?.testResponseDetails;
    }
    this.displayableTestName = this.test?.name || "Test";
    this.totalQuestionCount = this.test?.questionCount || 0;
    this.totalPointCount = this.test?.pointCount || 0;
  }

  /**
   * Note that this is an important way to identify which Testsegment/section Response applies to which Testsegment/section.
   * This can return an undefined if the Testsegment/section has no previously saved response.
   * @param testsegment: Testsegment
   * @return TestsegmentResponse type
   */
  getTestsectionResponseDetailsForTestsection(idTestsegment: string, idTestsection: string): ResponseDetails | undefined {
    let filterSegmentResults: TestsegmentResponse[] | undefined = this.testResponse?.testsegmentResponses.filter(x => x.idTestsegment == idTestsegment);
    if (filterSegmentResults && filterSegmentResults.length > 0) {
      let filterSectionResults: TestsectionResponse[] | undefined = filterSegmentResults[0].testsectionResponses.filter(y => y.idTestsection == idTestsection);
      if (filterSectionResults && filterSectionResults.length > 0) {
        return filterSectionResults[0].testsectionResponseDetails;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  public getFormattedSectionHeading(segmentindex: number, sectionindex: number, testsegmentName: string, testsectionName: string) {
    return TestsummaryComponent.getFormattedSectionHeadingStatic(segmentindex, sectionindex, testsegmentName, testsectionName);
  }
  public static getFormattedSectionHeadingStatic(segmentindex: number, sectionindex: number, testsegmentName: string, testsectionName: string) {
    return (segmentindex + 1) + "." + (sectionindex + 1) + ".) " + testsegmentName + " - " + testsectionName;

  }


  /**************************************************************************************************************************
    * Interface methods that need to be implemented to react to Test Events
    **************************************************************************************************************************/

  /**
   * Mark the questionProxy on the Test Answer Panel with question status.  First identify the Testsegment-section and the do the job.
   * @param testQuestionAnsweredEvent
   */
  onTestQuestionAnsweredEvent(testQuestionAnsweredEvent: TestConstants.TestQuestionAnsweredEvent) {
/*    // find the correct SectionAnswerPanelComponent and pass onteh message
    // reduce to the right testsection
    let filterResults: SectionAnswerPanelComponent[] | undefined = this.testsectionAnswerPanelRenderings?.filter(x => x.testsection?.idTestsection == testQuestionAnsweredEvent.idTestsection && x.idTestsegment == testQuestionAnsweredEvent.idTestsegment);
    if (filterResults && filterResults.length > 0) {
      console.log(`TestAnswerPanelComponent: renderQuestionStatus: ${JSON.stringify(testQuestionAnsweredEvent)}`);
      filterResults[0].renderQuestionStatus(testQuestionAnsweredEvent);
    } else {
      console.log(`TestAnswerPanelComponent: Some Effed up. Count not find the Appropriate Section for: ${JSON.stringify(testQuestionAnsweredEvent)}`);
    }
*/    return;
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
  public setTestResponse(newTestResponse: TestResponse) {
    this.testResponse = newTestResponse;
    // propogate the test Response Details
    if (this.testResponse && this.testResponse.testResponseDetails) {
      this.testStatsDisplayPanelRendering.responseDetails = this.testResponse.testResponseDetails;
    }
    // now propogate the section Response Details to each section

    for (let testsegmentResponse of newTestResponse.testsegmentResponses) {
      for (let testsectionResponse of testsegmentResponse.testsectionResponses) {
        let filterSectionStatsDisplayPanelRenderings: StatsDisplayPanelComponent[] | undefined = this.sectionStatsDisplayPanelRenderings?.filter(x => x.idTestsegment == testsegmentResponse.idTestsegment && x.idTestsection == testsectionResponse.idTestsection);
        if (filterSectionStatsDisplayPanelRenderings && filterSectionStatsDisplayPanelRenderings.length > 0) {
          filterSectionStatsDisplayPanelRenderings[0].responseDetails = testsectionResponse.testsectionResponseDetails;
        }
      }
    }
    this.changeDetectorRef.markForCheck();
  }

  /**************************************************************************************************************************
   * Interface methods that need to be implemented to react to Test Events
   **************************************************************************************************************************/








  /**
  * Perform any actions when invoked. Note that this functions is typically invoked as a result of some Menu Actions (Header -> App -> This)
  * @param action
  */
  public performTestRelatedFunction(action: TestConstants.TestActions) {
    console.log(`TestsummaryComponent.performTestRelatedFunction called with: ${action}`);
    this.testStatsDisplayPanelRendering.performTestRelatedFunction(action);
    this.sectionStatsDisplayPanelRenderings?.forEach((sectionStatsDisplayPanelRendering) => {
      //      console.log(testsegmentRendering);
      sectionStatsDisplayPanelRendering.performTestRelatedFunction(action);
    });
    this.changeDetectorRef.markForCheck();

  }



}

