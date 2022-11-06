import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ResponseDetails, Test, TestResponse, TestsectionResponse, TestsegmentResponse, Testwithresponse } from '@app/models/etestermodel';
import { StatsDisplayPanelComponent } from '@test/components/stats-display-panel/stats-display-panel.component';

@Component({
  selector: 'app-testsummary',
  templateUrl: './testsummary.component.html',
  styleUrls: ['./testsummary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestsummaryComponent implements OnInit {

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
  public setTestResponse(testResponse: TestResponse) {
    this.testResponse = testResponse;
    // propogate the test Response Details 
    if (this.testResponse && this.testResponse.testResponseDetails) {
      this.testStatsDisplayPanelRendering.responseDetails = this.testResponse.testResponseDetails;
    }
    // now propogate the section Response Details to each section

    for (let testsegmentResponse of testResponse.testsegmentResponses) {
      for (let testsectionResponse of testsegmentResponse.testsectionResponses) {
        let filterSectionStatsDisplayPanelRenderings: StatsDisplayPanelComponent[] | undefined = this.sectionStatsDisplayPanelRenderings?.filter(x => x.idTestsegment == testsegmentResponse.idTestsegment && x.idTestsection == testsectionResponse.idTestsection);
        if (filterSectionStatsDisplayPanelRenderings && filterSectionStatsDisplayPanelRenderings.length > 0) {
          filterSectionStatsDisplayPanelRenderings[0].responseDetails = testsectionResponse.testsectionResponseDetails;
        }
      }
    }
    this.changeDetectorRef.markForCheck();
  }



}

