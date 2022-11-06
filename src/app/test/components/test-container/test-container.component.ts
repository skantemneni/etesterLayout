import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticatableDataServerToken } from '@app/app.module';
import { Test, TestResponse, Testwithresponse } from '@app/models/etestermodel';
import * as TestConstants from '@app/models/TestConstants';
import { TestQuestionAnsweredEvent } from '@app/models/TestConstants';
import { IDataServer } from '@app/services/data.interface';
import { TestviewComponent } from '@test/components/testview/testview.component';

@Component({
  selector: 'app-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.scss']
})
export class TestContainerComponent implements OnInit {

  @Output() testQuestionAnsweredEvent = new EventEmitter<TestQuestionAnsweredEvent>();

  /**
   * The output parameter that publishes updates to Test Response and Test Stats
   */
  @Output() testResponseUpdater = new EventEmitter<TestResponse>();

  /**
   * The output parameter that publishes updates to Test Response and Test Stats
   */
  @Output() testwithresponseUpdater = new EventEmitter<Testwithresponse>();


  // Data Variables that are generally loaded via HTTP calls
  testwithresponse: Testwithresponse = {} as Testwithresponse;
  test?: Test;
  testStatus: string = TestConstants.TEST_STATUS_ASSIGNED;
  testResponse?: TestResponse;

  /**
   * This is a router parameter that tells us what userTest to render
   */
  usertestId: string = '0';

  // View Children that allows to communicate-to/invoke-action-on children view elements as needed
  //  @ViewChildren('testviewRendering') testsegmentRenderings: QueryList<TestviewComponent> | undefined;
  // Special case view children to get around a defect.  Read the comments on ngAfterViewInit()
  //  @ViewChildren('shivatestsegment') spans!: QueryList<ElementRef>;

  @ViewChild('testviewRendering') testviewRendering: TestviewComponent | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(AuthenticatableDataServerToken) private dataServer: IDataServer
//    , private etesterdbService: EtesterdbService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      console.log(`TestContainerComponent.ngOnInit.routeParams: ${JSON.stringify(params)}`);
      this.usertestId = params['usertestId'];
      console.log(`TestContainerComponent.ngOnInit.this.usertestId: ${this.usertestId}`);
      // Call to retrieve data
      this.getData(this.usertestId);
      //      this.changeDetectorRef.markForCheck();
    });
  }

  /**
   * This method takes the @Input usertestId and make the HTTP call to retrieve the data. And sets up the rest of the class variables to conduct business 
   * @param usertestId
   */
  getData(usertestId: string) {
    // Using a service here to get to the data from the etester database
    this.dataServer.getUserTestData(usertestId).subscribe(
      (testwithresponse: Testwithresponse) => {
        this.testwithresponse = testwithresponse;
        this.test = this.testwithresponse.test;
        this.testwithresponseUpdater.emit(testwithresponse);

        if (this.testwithresponse != null) {
          this.testviewRendering?.setTestWithResponse(this.testwithresponse);
        }
        // parse the serialized response object string if one is available
        if (this.testwithresponse.testResponse != null) {
          this.testResponse = JSON.parse(testwithresponse.testResponse);
        }
        //        this.changeDetectorRef.markForCheck();
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

  /**
   * This method reacts to the testResponse updated event triggered by the TestView component
   * 
   * @param testResponse
   */
  updateSummaryAndAnswerPanel(newTestResponse: TestResponse) {
    this.testResponseUpdater.emit(newTestResponse);
    //    this.testsummaryComponent?.setTestResponse(newTestResponse);
  }

  /**
  * Perform any actions when invoked. Note that this functions is typically invoked as a result of some Menu Actions (Header -> App -> This)
  * @param action
  */
  performTestAction(action: TestConstants.TestActions) {
    this.testviewRendering?.performTestRelatedFunction(action);
  }

  /**
   * This does one of 2 things based on the test render mode:
   * 1.) If the test renders one question at a time, we will simply render the particular question mentioned in the event
   * 2.) If the test renders ALL questions at the same time, we will scroll the view port to the correct question number
   * 
   * @param answerPanelQuestionButtonClickedEvent
   */
  renderQuestion(answerPanelQuestionButtonClickedEvent: TestConstants.AnswerPanelQuestionButtonClickedEvent): void {
    // reduce to the right testsegment
    this.testviewRendering?.renderQuestion(answerPanelQuestionButtonClickedEvent);
  }

  /**
   * Bubble up the TestQuestionAnsweredEvent.  
   * @param event
   */
  testQuestionAnsweredClicked(event: TestQuestionAnsweredEvent): void {
    // Emit the answer clicked event for a subscriber to consume
    this.testQuestionAnsweredEvent.emit(event);
  }



  /**
   * React to an event coming from Answer Panel
   * @param answerPanelQuestionButtonClickedEvent
   */
  answerItemClicked(answerPanelQuestionButtonClickedEvent: TestConstants.AnswerPanelQuestionButtonClickedEvent): void {
    this.renderQuestion(answerPanelQuestionButtonClickedEvent);
  }



}
