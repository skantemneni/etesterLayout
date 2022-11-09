import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Testsection, QuestionResponse, TestsectionResponse, ITestsectionResponse, ResponseDetails, Question } from '../../../models/etestermodel';
import * as TestConstants from '@app/models/TestConstants';
import { QuestionComponent } from '@qa/components/question/question.component';
import { TestQuestionAnsweredEvent } from '@app/models/TestConstants';

@Component({
  selector: 'app-testsection',
  templateUrl: './testsection.component.html',
  styleUrls: ['./testsection.component.scss']
})
export class TestsectionComponent implements OnInit {

  @Output() testQuestionAnsweredEvent = new EventEmitter<TestQuestionAnsweredEvent>();

  /**
   * Inputs for this component
   */
  @Input() testsection?: Testsection;
  @Input() testsectionResponse?: TestsectionResponse;
  @Input() segmentsectionindex: number = 0;
  @Input() testStatus: string = TestConstants.TEST_STATUS_ASSIGNED;
//  @Input() defaultQuestionInstructions?: string;
  @Input() instantGradeMode: boolean = false;

  initialTestQuestionResponseArray?: QuestionResponse[];

  // View Children that allows to communicate-to/invoke-action-on children view elements as needed
  @ViewChildren('questionRendering') questionRenderings: QueryList<QuestionComponent> | undefined;

  // View Children that allow us to reposition the window to the appropriate scroll position
  @ViewChildren('questionAnswerBlock', {read: ElementRef}) questionAnswerBlocks: QueryList<ElementRef> | any;

/*  @ViewChildren('questionRendering') questionRenderings: QueryList<QuestionComponent> | undefined;
  @ViewChildren('questionRendering', { read: ElementRef }) myChartContainer: ElementRef;
*/  /**
   * None to do really.
   */
 constructor() { }

  // local variables that will be passed tp each question
  pointsPerQuestion: number = 0;
  negativePointsPerQuestion: number = 0;
  unansweredPointsPerQuestion: number = 0;

  /**
   * Again, nothing to do really.  Perhaps we can log statements to ensure we have receive teh right inputs.
   */
  ngOnInit(): void {
    this.pointsPerQuestion = this.testsection?.pointsPerQuestion || this.testsection?.section.pointsPerQuestion || 0;
    this.negativePointsPerQuestion = this.testsection?.negativePointsPerQuestion || this.testsection?.section.negativePointsPerQuestion || 0;
    this.unansweredPointsPerQuestion = this.testsection?.unansweredPointsPerQuestion || this.testsection?.section.unansweredPointsPerQuestion || 0;
    // also read any previous responses into the array
    this.initialTestQuestionResponseArray = this.testsectionResponse?.questionResponses;
  }

  /**
   * Perform any actions when invoked. Note that this functions is typically invoked as a result of some Menu Actions. (Header -> App -> Test -> TestSegment - Testsection).
   * @param action
   */
  performTestRelatedFunction(action: TestConstants.TestActions) {
    console.log(`TestsectionComponent: performTestRelatedFunction() Called! with action: ${action}`);
    this.questionRenderings?.forEach((questionRendering) => {
//      console.log(questionRendering);
      questionRendering.performTestRelatedFunction(action);
    });
  }

  /**
   *  Note that this is an important way to identify which QuestionResponse applies to which Question.  This can return an undefined if the Question has no previously saved response.
   * @param question: Question
   * @return QuestionResponse type
   */
  getInitialQuestionResponseForQuestion(question: Question): QuestionResponse | undefined {
    let filterResults: QuestionResponse[] | undefined = this.initialTestQuestionResponseArray?.filter(x => x.idQuestion == question.idQuestion);
    if (filterResults && filterResults.length > 0) {
      return filterResults[0];
    } else {
      return undefined;
    }
  }

  /**
  * Create a Test Response objecte that can be used to render stats and to serialize and store "state" in a persistant location - localstorage or database.
  */
 public getResponse(): ITestsectionResponse {
    let questionResponses: QuestionResponse[] = [] as QuestionResponse[];

    if (this.questionRenderings && this.questionRenderings.length > 0) {
      let questionResponses: QuestionResponse[] = this.questionRenderings?.map(function (questionRendering): QuestionResponse {
        return questionRendering.getResponse();
      });
      let [answeredCount, answeredPoints, correctCount, correctPoints] = this.getStatCounts();

      let timeSpentOnSection: number = this.getTimeSpentOnSection();
      
      let testsectionResponse: ITestsectionResponse = new TestsectionResponse((this.testsection) ? this.testsection.idTestsection : "", (this.testsection) ? this.testsection?.idSectionRef : "", questionResponses, new ResponseDetails(answeredCount, answeredPoints, correctCount, correctPoints));
      return testsectionResponse;
    }
    // return "" otherwise
    return new TestsectionResponse("", "", [] as QuestionResponse[], new ResponseDetails(0,0,0,0) );
  }

  /**
   * Aggregate across the lower level objects (questions) to come up with Stat counts for this Testsection
   */
  public getStatCounts(): number[] {
    if (this.questionRenderings && this.questionRenderings.length > 0) {

      let sectionStats =
        this.questionRenderings?.map(function (questionRendering): [number, number, number, number] {
          return questionRendering.getStatCountsTuple();
        }
        ).reduce(function ([a1, a2, a3, a4], [b1, b2, b3, b4]): [number, number, number, number] { return [a1 + b1, a2 + b2, a3 + b3, a4 + b4]; });
      let [answeredCount, answeredPoints, correctCount, correctPoints] = sectionStats;
      return [answeredCount, answeredPoints, correctCount, correctPoints];
    } else {
      return [] as number[];
    }

  }

  /**
   * This function is not implemented yet.  For now we simply return a random number of 85 seconds
   *
   */
  public getTimeSpentOnSection(): number {
    return 85;
  }




  onAnswerPanelClicked(answerPanelQuestionButtonClickedEvent: TestConstants.AnswerPanelQuestionButtonClickedEvent): void {
    console.log(`testsection: received AnswerPanelQuestionButtonClickedEvent: ${JSON.stringify(answerPanelQuestionButtonClickedEvent)}`)
    let { idTestsegment, idTestsection, idQuestion } = answerPanelQuestionButtonClickedEvent;
    console.log(`testview: received AnswerPanelClickedEvent: ${idTestsegment}, ${idTestsection}, ${idQuestion}`)

    let targetTestquestionComponent = this.findQuestionforId(idTestsection);
    if (targetTestquestionComponent) {
//      targetTestquestionComponent.onAnswerPanelClicked(answerPanelClickedEvent);
    }

  }





  findQuestionforId(idQuestion: string): QuestionComponent | undefined {
    let filterResults: QuestionComponent[] | undefined = this.questionRenderings?.filter(x => x.question?.idQuestion == idQuestion);
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
    // reduce to the right question
/*    console.log(`Log all the questionAnswerBlock DIV's`);
    console.log(`Size of questionAnswerBlocks: ${this.questionAnswerBlocks?.length}`);
    console.log(`Size of questionRenderings: ${this.questionRenderings?.length}`);
    this.questionAnswerBlocks.forEach((questionAnswerBlock: ElementRef) => console.log(questionAnswerBlock.nativeElement));
    console.log(`Log all the questionAnswerBlock DIV's`);
*/
    let filterResults: ElementRef[] | undefined = this.questionAnswerBlocks?.filter((questionAnswerBlock: ElementRef) => questionAnswerBlock.nativeElement.getAttribute('idquestion') == answerPanelQuestionButtonClickedEvent.idQuestion);
    let targetQuestion: ElementRef | undefined = undefined;
    if (filterResults && filterResults.length > 0) {
      targetQuestion = filterResults[0];
    }
    if (targetQuestion) {
      console.log(`Found the Target questionAnswerBlock DIV`);
      console.log(targetQuestion.nativeElement);
      targetQuestion.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.log(`DID NOT Find the Target questionAnswerBlock`);
    }
    return;
  }



  /**
   * Bubble up the TestQuestionAnsweredEvent.  This merely consumes an event from a Question, adds teh idTestsection and emilts again.
   * @param event
   */
  testQuestionAnsweredClicked(event: TestQuestionAnsweredEvent): void {
    // Decorate with Testsection ID and re-Emit the answer clicked event for a subscriber to consume 
    let testQuestionAnsweredEvent = { ...event, idTestsection: this.testsection ? this.testsection.idTestsection: ''};
    this.testQuestionAnsweredEvent.emit(testQuestionAnsweredEvent);
  }

}
