import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList, ViewChildren, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { EtesterdbService } from '@app/services/etesterdb.service';
import { Testwithresponse, Test, Testsegment, Testsection, Section, Question, Answer, TestsegmentResponse, ITestResponse, ResponseDetails, TestResponse } from '../../../models/etestermodel';
import * as TestConstants from '@app/models/TestConstants';
import { TestsegmentComponent } from '@test/components/testsegment/testsegment.component';
import { TestQuestionAnsweredEvent } from '@app/models/TestConstants';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';

/**
 * Class Comments.
 * Initialize the Data coming from the database.  Note that the "Data" object is actually the "Test" and any copy of a previous "response" object.
 * For now the "Test" and "Response" are a single call to the database in what is being built as a "TestWithResponse".
 * We will split this up in teh future.
 */



@Component({
  selector: 'app-testview',
  templateUrl: './testview.component.html',
  styleUrls: ['./testview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestviewComponent implements OnInit, AfterViewInit {

  /**
   * Constructor that is initialized with the HTTP client that can access the DataBase.
   * @param etesterdbService
   */
  constructor(private etesterdbService: EtesterdbService, private changeDetectorRef: ChangeDetectorRef) {
  }

  /**
   * The only thing to do is get Data.  That is an async HTTP call and so is not available in teh constructor at Build time.
   */
  ngOnInit(): void {
  }

  // Main input via setter and getter
  private _testwithresponse?: Testwithresponse | undefined = undefined;
  @Input()
  public get testwithresponse(): Testwithresponse | undefined {
    return this._testwithresponse;
  }
  public set testwithresponse(testwithresponse: Testwithresponse | undefined) {
    console.log(`TestviewComponent.set testwithresponse: ${testwithresponse}`)
    this._testwithresponse = testwithresponse;
    this.test = this._testwithresponse?.test;
    if (this.test) {
      this.testsegments = this.test.testsegments;
    }
    this.testStatus = this.testwithresponse && this.testwithresponse.testStatus ? this.testwithresponse.testStatus : TestConstants.TEST_STATUS_ASSIGNED;
    if (this._testwithresponse?.testResponse) {
      this.initialTestResponse = JSON.parse(this._testwithresponse.testResponse);
      this.initialTestsegmentResponseArray = this.initialTestResponse?.testsegmentResponses;
    }

  }

  @Output() testQuestionAnsweredEvent = new EventEmitter<TestQuestionAnsweredEvent>();

  // Data Variables that are generally loaded via HTTP calls
  test?: Test;
//  testwithresponse: Testwithresponse;
  testsegments?: Testsegment[];
  initialTestResponse?: TestResponse;
  initialTestsegmentResponseArray?: TestsegmentResponse[];
  testStatus: string = TestConstants.TEST_STATUS_ASSIGNED;
  //  isTestLocked = false; 

  /**
   * The input parameter that tells us what userTest to render
   */
  @Input() usertestId: number = 0;

  // View Children that allows to communicate-to/invoke-action-on children view elements as needed
  @ViewChildren('testsegmentRendering') testsegmentRenderings: QueryList<TestsegmentComponent> | undefined;
  // Special case view children to get around a defect.  Read the comments on ngAfterViewInit()
  @ViewChildren('shivatestsegment') spans!: QueryList<ElementRef>;

  @ViewChildren("expansionPanel", { read: ElementRef }) expansionPanelElems: QueryList<ElementRef> | undefined;
  @ViewChildren("expansionPanel") expansionPanels: QueryList<MatExpansionPanel> | undefined;

  /**
   * The output parameter that publishes updates to Test Response and Test Stats
   */
  @Output() testResponseUpdater = new EventEmitter<TestResponse>();


/*  setTestAndResponse(test: Test, testStatus: string, testResponse?: TestResponse) {
    this.test = test;
    if (this.test) {
      this.testsegments = this.test.testsegments;
    }
    this.testStatus = testStatus;
    this.initialTestResponse = testResponse;
    this.initialTestsegmentResponseArray = this.initialTestResponse?.testsegmentResponses;
*//*    if (this.testsegmentRenderings) {
      console.log(`TestviewComponent.this.testsegmentRenderings.length: ${this.testsegmentRenderings.length}`)
    } else {
      console.log(`TestviewComponent.this.testsegmentRenderings.length: 0`)
    }
*//*    this.changeDetectorRef.markForCheck();
  }
*/
  /**
   * Perform any actions when invoked. Note that this functions is typically invoked as a result of some Menu Actions (Header -> App -> This)
   * @param action
   */
  performTestRelatedFunction(action: TestConstants.TestActions) {
    console.log(`TestviewComponent.performTestRelatedFunction called with: ${action}`)
    //    console.log(`TestAccordionviewComponent: performTestAction() Called! with action: ${action}`);
    this.testsegmentRenderings?.forEach((testsegmentRendering) => {
      //      console.log(testsegmentRendering);
      testsegmentRendering.performTestRelatedFunction(action);
    });

    if (this.testsegmentRenderings && this.testsegmentRenderings.length > 0) {
      // For now "Grade" does a "Save" as well.  Now if the test task was to "grade", serialize the response and save with a status complete=true
      if (action == TestConstants.TestActions.GRADE) {
        this.saveTest(true);
      } else if (action == TestConstants.TestActions.SAVE) {
        this.saveTest(false);
      } else if (action == TestConstants.TestActions.UNGRADE || action == TestConstants.TestActions.RESTART || action == TestConstants.TestActions.CONTINUE) {
        // simply publish responses
        this.publishResponse();
      }
    }
  }
  /**
   * Creates teh TestResponse JSON object, serializes it and sends it to teh database for storage 
   * @param testResponse
   */
  private saveTest(completed: boolean = false): void {
    // Create the testResponse
    let testResponse: TestResponse = this.getResponse();
    // send an update event to update stats and answer panel, if necessary
    this.testResponseUpdater.emit(testResponse);
    // save the test response tp storage
    this.etesterdbService.saveTestResponse(this.usertestId, testResponse, completed);
  }

  /**
   * Creates the TestResponse JSON object, and simply publish it. 
   * @param testResponse
   */
  private publishResponse(completed: boolean = false): void {
    // Create the testResponse
    let testResponse: TestResponse = this.getResponse();
    // send an update event to update stats and answer panel, if necessary
    this.testResponseUpdater.emit(testResponse);
  }


  /**
   *  Note that this is an important way to identify which TestsegmentResponse applies to which Testsegment.  This can return an undefined if the Testsegment has no previously saved response.
   * @param testsegment: Testsegment
   * @return TestsegmentResponse type
   */
  getInitialTestsegmentResponseForTestsegment(testsegment: Testsegment): TestsegmentResponse | undefined {
    let filterResults: TestsegmentResponse[] | undefined = this.initialTestsegmentResponseArray?.filter(x => x.idTestsegment == testsegment.idTestsegment);
    if (filterResults && filterResults.length > 0) {
      return filterResults[0];
    } else {
      return undefined;
    }
  }


  /**
   * Create a Test Response objecte that can be used to render stats and to serialize and store "state" in a persistant location - localstorage or database.
   */
  public getResponse(): ITestResponse {
    if (this.testsegmentRenderings && this.testsegmentRenderings.length > 0) {
      let testsegmentResponses: TestsegmentResponse[] = this.testsegmentRenderings?.map(function (testsegmentRendering): TestsegmentResponse {
        return testsegmentRendering.getResponse();
      });

      let testStats =
        testsegmentResponses.map(function (testsegmentResponse): [number, number, number, number] {
          return [testsegmentResponse.testsegmentResponseDetails.answeredCount, testsegmentResponse.testsegmentResponseDetails.answeredPoints, testsegmentResponse.testsegmentResponseDetails.correctCount, testsegmentResponse.testsegmentResponseDetails.correctPoints];
        }
        ).reduce(function ([a1, a2, a3, a4], [b1, b2, b3, b4]): [number, number, number, number] { return [a1 + b1, a2 + b2, a3 + b3, a4 + b4]; });

      let [answeredCount, answeredPoints, correctCount, correctPoints] = testStats;
      let testResponse = new TestResponse((this.test) ? this.test.idTest : "", testsegmentResponses, new ResponseDetails(answeredCount, answeredPoints, correctCount, correctPoints));

      return testResponse;

    }
    // return "" otherwise
    return new TestResponse("", [] as TestsegmentResponse[], new ResponseDetails(0, 0, 0, 0));
  }




  /**
   * This function is not implemented yet.  For now we simply return a random number of 311 seconds
   *
   */
  public getTimeSpentOnTest(): number {
    return 311;
  }

  /**
   * Aggregate across the lower level objects (testsegments) to come up with Stat counts for this Test
   */
  public getStatCounts(): number[] {
    if (this.testsegmentRenderings && this.testsegmentRenderings.length > 0) {
      let testsegmentStatTuples = this.testsegmentRenderings.map(function (testsegmentRendering): number[] {
        return testsegmentRendering.getStatCounts();
      });

      let testStats =
        testsegmentStatTuples.reduce(function ([a1, a2, a3, a4], [b1, b2, b3, b4]): [number, number, number, number] { return [a1 + b1, a2 + b2, a3 + b3, a4 + b4]; });

      let [answeredCount, answeredPoints, correctCount, correctPoints] = testStats;
      console.log(`testStats:  ${answeredCount}, ${answeredPoints}, ${correctCount}, ${correctPoints}`);
      return [answeredCount, answeredPoints, correctCount, correctPoints];
    } else {
      return [] as number[];
    }

  }



  ngAfterViewInit() {
    // What I am doing in the next block of code is the most mind boggling of all.
    // My god.  The crap I have to put up with with Angular, Google and the Bastards! there.  Forgive my language.
    // https://stackoverflow.com/questions/51544875/angular-changes-subscribe-not-firing
    // for all the good Google does, they fuck it up with the most intricate of details.
    // ********************************************************************************************************* //
    this.spans.changes.subscribe(value => {
      console.log(`TestView.ngAfterViewInit: Subscribing to Redundent Spans values: ${value}`);
      this.spans.map((span => { ; }))
      //      console.log(`1.this.segmentAccordianRenderings.length: ${this.testsegmentRenderings?.length}`);
    });
    // ********************************************************************************************************* //
    //    console.log(`2.this.segmentAccordianRenderings.length: ${this.testsegmentRenderings?.length}`);
  }





  /*  onAnswerPanelClicked(answerPanelQuestionButtonClickedEvent: TestConstants.AnswerPanelQuestionButtonClickedEvent): void {
      console.log(`testview: received AnswerPanelQuestionButtonClickedEvent: ${JSON.stringify(answerPanelQuestionButtonClickedEvent)}`)
      let { idTestsegment, idTestsection, idQuestion } = answerPanelQuestionButtonClickedEvent;
      console.log(`testview: received AnswerPanelClickedEvent: ${idTestsegment}, ${idTestsection}, ${idQuestion}`);
      // Expand all expansion panels
      if (this.accordion) {
        console.log(`Found Accordian.  Will expand all`);
        this.accordion.openAll();
      } else {
        console.log(`NO Accordian.  WTF`);
      }
      let targetTestsegmentComponent = this.findTestsegmentforId(idTestsegment);
      if (targetTestsegmentComponent) {
        targetTestsegmentComponent.onAnswerPanelClicked(answerPanelQuestionButtonClickedEvent);
      }
      
    }
  */




  findTestsegmentforId(idTestsegment: string): TestsegmentComponent | undefined {
    let filterResults: TestsegmentComponent[] | undefined = this.testsegmentRenderings?.filter(x => x.testsegment?.idTestsegment == idTestsegment);
    if (filterResults && filterResults.length > 0) {
      return filterResults[0];
    } else {
      return undefined;
    }
  }


  /**
   * This does one of 2 things based on the test render mode:
   * 1.) If the test renders one question at a time, we will simply render the particular question mentioned in the event
   * 2.) If the test renders ALL questions at the same time, we will scroll the view port to the correct question number
   * 
   * @param answerPanelQuestionButtonClickedEvent
   */
  renderQuestion(answerPanelQuestionButtonClickedEvent: TestConstants.AnswerPanelQuestionButtonClickedEvent): void {
    if (this.expansionPanels && this.expansionPanels.length > 0) {
      // The approach followed here is suggested by "https://stackoverflow.com/questions/62548235/how-to-access-the-id-of-the-elements-inside-viewchildren"
      const selectedPanelIdx = this.expansionPanelElems?.toArray().findIndex(e => {
        return e.nativeElement.getAttribute('idtestsegment') == answerPanelQuestionButtonClickedEvent.idTestsegment;
      });
      let targetExpansionPanel = this.expansionPanels.toArray()[selectedPanelIdx ? selectedPanelIdx : 0];
      if (targetExpansionPanel.expanded) {
        let filterResults: TestsegmentComponent[] | undefined = this.testsegmentRenderings?.filter(x => x.testsegment?.idTestsegment == answerPanelQuestionButtonClickedEvent.idTestsegment);
        if (filterResults && filterResults.length > 0) {
          filterResults[0].renderQuestion(answerPanelQuestionButtonClickedEvent);
        }
      } else {
        this.expansionPanels.toArray()[selectedPanelIdx ? selectedPanelIdx : 0].open();
        /* Wait 500 milliseconds delay fro expansion to complete */
        setTimeout(() => {
          let filterResults: TestsegmentComponent[] | undefined = this.testsegmentRenderings?.filter(x => x.testsegment?.idTestsegment == answerPanelQuestionButtonClickedEvent.idTestsegment);
          if (filterResults && filterResults.length > 0) {
            filterResults[0].renderQuestion(answerPanelQuestionButtonClickedEvent);
          }
        }, 500);
      }
      return;
    } else {
      console.error(`TestviewComponent: expansionPanels.size: 0`);
    }
  }

  /**
   * Bubble up the TestQuestionAnsweredEvent.  
   * @param event
   */
  testQuestionAnsweredClicked(event: TestQuestionAnsweredEvent): void {
    // Emit the answer clicked event for a subscriber to consume
    //    console.log(`TestView: TestQuestionAnsweredEvent.answerItemClicked: ${JSON.stringify(event)}`);
    this.testQuestionAnsweredEvent.emit(event);
  }
}
