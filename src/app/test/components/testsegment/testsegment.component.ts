import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ITestsegmentResponse, ResponseDetails, Testsection, TestsectionResponse, Testsegment, TestsegmentResponse } from '../../../models/etestermodel';
import { TestsectionComponent } from '../testsection/testsection.component';
import * as TestConstants from '../../../models/TestConstants';
import { TestQuestionAnsweredEvent } from '../../../models/TestConstants';

@Component({
  selector: 'app-testsegment',
  templateUrl: './testsegment.component.html',
  styleUrls: ['./testsegment.component.scss']
})
export class TestsegmentComponent implements OnInit {

  @Output() testQuestionAnsweredEvent = new EventEmitter<TestQuestionAnsweredEvent>();

  /**
   * Inputs for this component
   */
  @Input() testsegment?: Testsegment;
  @Input() testsegmentResponse?: TestsegmentResponse;
  @Input() testsegmentindex: number = 0;
  @Input() testStatus: string = TestConstants.TEST_STATUS_ASSIGNED;
  @Input() instantGradeMode: boolean = false;

  initialTestsectionResponseArray?: TestsectionResponse[];

  //  @Input() defaultQuestionInstructions?: string;

  // View Children that allows to communicate-to/invoke-action-on children view elements as needed
  @ViewChildren('testsectionRendering') testsectionRenderings: QueryList<TestsectionComponent> | undefined;

  /**
   * None to do really.
   */
  constructor() { }

  /**
   * Again, nothing to do really.  Perhaps we can log statements to ensure we have receive teh right inputs.
   */
  ngOnInit(): void {
    if (this.testsegmentResponse != null) {
      this.initialTestsectionResponseArray = this.testsegmentResponse.testsectionResponses;
    }
//    console.log(`testsegment.idTestsegment: ${this.testsegment?.idTestsegment}`);
//    console.log(`testsegment.testsegmentResponse: ${this.testsegmentResponse?.idTestsegment}`);
  }

  /**
   * Perform any actions when invoked. Note that this functions is typically invoked as a result of some Menu Actions. (Header -> App -> Test -> TestSegment).
   * @param action
   */
  performTestRelatedFunction(action: TestConstants.TestActions) {
    console.log(`TestsegmentComponent.performTestRelatedFunction called with: ${action}`)

    this.testsectionRenderings?.forEach((testsectionRendering) => {
      testsectionRendering.performTestRelatedFunction(action);
    });
  }

  /**
   *  Note that this is an important way to identify which TestsectionResponse applies to which Testsection.  This can return an undefined if the Testsection has no previously saved response.
   * @param testsection: Testsection
   * @return TestsectionResponse type
   */
  getInitialTestsectionResponseForTestsection(testsection: Testsection): TestsectionResponse | undefined {
    let filterResults: TestsectionResponse[] | undefined = this.initialTestsectionResponseArray?.filter(x => x.idTestsection == testsection.idTestsection);
    if (filterResults && filterResults.length > 0) {
      return filterResults[0];
    } else {
      return undefined;
    }
  }

  /**
   * Create a Test Response objecte that can be used to render stats and to serialize and store "state" in a persistant location - localstorage or database.
   */
  public getResponse(): ITestsegmentResponse {
    if (this.testsectionRenderings && this.testsectionRenderings.length > 0) {
      let testsectionResponses: TestsectionResponse[] = this.testsectionRenderings?.map(function (testsectionRendering): TestsectionResponse {
        return testsectionRendering.getResponse();
      });
      let segmentStats =
        testsectionResponses.map(function (testsectionResponse): [number, number, number, number] {
          return [testsectionResponse.testsectionResponseDetails.answeredCount, testsectionResponse.testsectionResponseDetails.answeredPoints, testsectionResponse.testsectionResponseDetails.correctCount, testsectionResponse.testsectionResponseDetails.correctPoints];
        }
        ).reduce(function ([a1, a2, a3, a4], [b1, b2, b3, b4]): [number, number, number, number] { return [a1 + b1, a2 + b2, a3 + b3, a4 + b4]; });
      let [answeredCount, answeredPoints, correctCount, correctPoints] = segmentStats;
      let testsegmentResponse = new TestsegmentResponse((this.testsegment) ? this.testsegment.idTestsegment : "", testsectionResponses, new ResponseDetails(answeredCount, answeredPoints, correctCount, correctPoints));
      return testsegmentResponse;

    }
    // return "" otherwise
    return new TestsegmentResponse("", [] as TestsectionResponse[], new ResponseDetails(0, 0, 0, 0));
  }


  /**
   * This function is not implemented yet.  For now we simply return a random number of 85 seconds
   */
  public getTimeSpentOnSegment(): number {
    return 192;
  }


  /**
   * Aggregate across the lower level objects (testsections) to come up with Stat counts for this Testsegment
   */

  public getStatCounts(): number[] {
    if (this.testsectionRenderings && this.testsectionRenderings.length > 0) {
      let testsectionStatTuples = this.testsectionRenderings.map(function (testsectionRendering): number[] {
        return testsectionRendering.getStatCounts();
      });

      let testsegmentStats =
        testsectionStatTuples.reduce(function ([a1, a2, a3, a4], [b1, b2, b3, b4]): [number, number, number, number] { return [a1 + b1, a2 + b2, a3 + b3, a4 + b4]; });

      let [answeredCount, answeredPoints, correctCount, correctPoints] = testsegmentStats;
      console.log(`testsegmentStats:  ${answeredCount}, ${answeredPoints}, ${correctCount}, ${correctPoints}`);
      return [answeredCount, answeredPoints, correctCount, correctPoints];
    } else {
      return [] as number[];
    }

  }

  onAnswerPanelClicked(answerPanelQuestionButtonClickedEvent: TestConstants.AnswerPanelQuestionButtonClickedEvent): void {
    console.log(`testsegment: received answerPanelQuestionButtonClickedEvent: ${JSON.stringify(answerPanelQuestionButtonClickedEvent)}`)
    let { idTestsegment, idTestsection, idQuestion } = answerPanelQuestionButtonClickedEvent;
    console.log(`testview: received AnswerPanelClickedEvent: ${idTestsegment}, ${idTestsection}, ${idQuestion}`)

    let targetTestsectionComponent = this.findTestsectionforId(idTestsection);
    if (targetTestsectionComponent) {
      targetTestsectionComponent.onAnswerPanelClicked(answerPanelQuestionButtonClickedEvent);
    }

  }





  findTestsectionforId(idTestsection: string): TestsectionComponent | undefined {
    let filterResults: TestsectionComponent[] | undefined = this.testsectionRenderings?.filter(x => x.testsection?.idTestsection == idTestsection);
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
    // reduce to the right testsection
    let filterResults: TestsectionComponent[] | undefined = this.testsectionRenderings?.filter(x => x.testsection?.idTestsection == answerPanelQuestionButtonClickedEvent.idTestsection);
    if (filterResults && filterResults.length > 0) {
      filterResults[0].renderQuestion(answerPanelQuestionButtonClickedEvent);
    }
    return;
  }

  /**
   * Bubble up the TestQuestionAnsweredEvent.  This merely consumes an event from a Testsection, adds the idTestsegment and emilts again.
   * @param event
   */
  testQuestionAnsweredClicked(event: TestQuestionAnsweredEvent): void {
    // Emit the answer clicked event for a subscriber to consume
    let testQuestionAnsweredEvent: TestQuestionAnsweredEvent = {
      idTestsegment: this.testsegment ? this.testsegment.idTestsegment : '',
      idTestsection: event.idTestsection,
      idQuestion: event.idQuestion,
      questionStatus: event.questionStatus
    };
    console.log(`TestSegment: TestQuestionAnsweredEvent.answerItemClicked: ${JSON.stringify(testQuestionAnsweredEvent)}`);
    this.testQuestionAnsweredEvent.emit(testQuestionAnsweredEvent);
  }



}
