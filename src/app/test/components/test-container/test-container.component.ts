import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticatableDataServerToken } from '@app/app.module';
import { Test, TestResponse, Testwithresponse } from '@app/models/etestermodel';
import * as TestConstants from '@app/models/TestConstants';
import { TestQuestionAnsweredEvent } from '@app/models/TestConstants';
import { IDataServer } from '@app/services/data.interface';
import { TestviewComponent } from '@test/components/testview/testview.component';
import { TestAnswerPanelComponent } from '../test-answer-panel/test-answer-panel.component';
import { TestsummaryComponent } from '../testsummary/testsummary.component';

@Component({
  selector: 'app-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.scss']
})
export class TestContainerComponent implements OnInit {

  constructor(
    @Inject(AuthenticatableDataServerToken) private dataServer: IDataServer
  ) { }

  ngOnInit(): void { }

  /**
   * The input parameter that tells us what userTest to render
   */
  //  @Input() usertestId: any = 0;
  _usertestId: any = undefined;
  @Input()
  get usertestId() {
    return this._usertestId;
  };
  set usertestId(usertestId: string | undefined) {
    this._usertestId = usertestId;
    if (this._usertestId) {
      this.getData(this._usertestId);
    }

  }

  /**
   * The output parameter that publishes updates to Test Response and Test Stats
   */
//  @Output() testResponseUpdater = new EventEmitter<TestResponse>();

  // Data Variables that are generally loaded via HTTP calls
  testwithresponse: Testwithresponse = {} as Testwithresponse;
  testStatus: string = TestConstants.TEST_STATUS_ASSIGNED;
  testResponse?: TestResponse;

  // View Children that allows to communicate-to/invoke-action-on children view elements as needed
  //  @ViewChildren('testviewRendering') testsegmentRenderings: QueryList<TestviewComponent> | undefined;
  // Special case view children to get around a defect.  Read the comments on ngAfterViewInit()
  //  @ViewChildren('shivatestsegment') spans!: QueryList<ElementRef>;

  @ViewChild('testviewRendering') testviewRendering: TestviewComponent | undefined;
  @ViewChild('testAnswerPanelComponent') testAnswerPanelComponent: TestAnswerPanelComponent | undefined;
  @ViewChild('testsummaryComponent') testsummaryComponent: TestsummaryComponent | undefined;

  /**
   * This method takes the @Input usertestId and make the HTTP call to retrieve the data. And sets up the rest of the class variables to conduct business 
   * @param usertestId
   */
  getData(usertestId: string) {
    // Using a service here to get to the data from the etester database
    this.dataServer.getUserTestData(usertestId).subscribe(
      (testwithresponse: Testwithresponse) => {
        // Log the test response if its empty...
        if (testwithresponse.idTest === "-1") {
          console.log(`TestContainerComponent.getData for: ${usertestId} returns: ${JSON.stringify(testwithresponse)}`);
        }

        // This next statement will already kick off all 3 sub-panels that constitute the Test Cantainer.  Namely, TestAnswerPanel, TestSummaryPanel and the TestView Panel
        this.testwithresponse = testwithresponse;
      },
      (error) => {
        if (error["status"] == 403) {
          // indicates login token expiry
          console.error('Request failed Token Expired error');
          //          this.etesterdbService.loginAndGetToken(ServiceConstants.username, ServiceConstants.password);
        } else {
          console.error('Request failed with error')
          alert(JSON.stringify(error));
        }
      }
    );
  }
}
