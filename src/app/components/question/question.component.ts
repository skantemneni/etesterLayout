import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { IResponseDetails, Question, QuestionResponse, ResponseDetails } from '../../models/etestermodel';
import { TestQuestionAnsweredEvent } from '../../models/TestConstants';
import * as TestConstants from '../../models/TestConstants';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit, OnChanges {

  @Output() testQuestionAnsweredEvent = new EventEmitter<TestQuestionAnsweredEvent>();

  /**
   * Static constants used within this (Question) component
   */
  static QUESTION_LINE_DELIMITER: string = "\\$\\$\\$\\$";
  static MULTIPLE_CHOICE_QUESTION_TYPE_DEFAULT_INSTRUCTIONS: string = "";
  static DEFAULT_UNANSWERED_ANSWER_INDEX = -1
  /*  static NEGATIVE_NUMBER_ENCLOSE_BEGIN: string = "(";
    static NEGATIVE_NUMBER_ENCLOSE_END: string = ")";
  */

  /**
   * Inputs for this component
   */
  @Input() question?: Question;
  @Input() questionResponse?: QuestionResponse;
  @Input() sectionquestionindex: number = 0;
  @Input() defaultQuestionInstructions?: string;
  @Input() instantGradeMode: boolean = false;
  @Input() testStatus = "testStatus";


  /**
   * Inputs for scoring information.  Normally this resides on the Test Section with the "embeded section" contaning the defaults
   */
  @Input() pointsPerQuestion: number = 0;
  @Input() negativePointsPerQuestion: number = 0;
  @Input() unansweredPointsPerQuestion: number = 0;
  /**
   * Points Score for this question.
   * Closely related to the Inputs above. 
   */
  public getScore(): number {
    if (this.QuestionIsAnsweredCorrectly == null) {
      return this.unansweredPointsPerQuestion;
    } else {
      if (this.QuestionIsAnsweredCorrectly) {
        return this.pointsPerQuestion;
      } else {
        return this.negativePointsPerQuestion;
      }
    }
  }

  /*
   * Variable that will hold the MathJax JS object so we can Typeset as needed
   */
  mathJaxObject: any;


  /**
   * Local variables:  Question Display Control Variables
   */

  // used in the specific scenaris when teh user has chosen a test-action to "Continue" on a test.
  // "Continue" status keeps showing the correctness and does instant grade on all future responses.
  // All other test actions will uimmediately set this status to false
  temporaryInstantGradeStatus: boolean = false;

  // This question may be locked for any further edits
  locked: boolean = false;
  SelectedAnswerIndex = QuestionComponent.DEFAULT_UNANSWERED_ANSWER_INDEX;
  SelectedAnswerIndexSet: Set<number> = new Set<number>();
  QuestionIsAnsweredCorrectly: boolean | null = null;
  questionStatus = TestConstants.QuestionStatus.NOT_ANSWERED;
  questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.NOT_ANSWERED;
  isMultipleAnswers: boolean = false;

  /**
   * Local Variables: Question Display Information
   */
  questionHeading: string | null = null;
  questionsetText: string | null = null;
  questionPrecontext: string | null = null;
  questionPostcontext: string | null = null;
  questionTextArray: string[] = [];
  questionInstructions: string | null = null;


  /**
   * Get the Question Response to Save.  This structure can be serialized in JSON
   */
  public getResponse(): QuestionResponse {

    // calculate serialized selections:
    let serializedResponse: string = "";
    if (this.question) {
      if (this.question.multipleAnswers) {
        // Response is stored in SelectedAnswerIndexSet.  Serialize it.
        for (let choice = 0; choice < this.question.answers.length; choice++) {
          serializedResponse = serializedResponse.concat(this.SelectedAnswerIndexSet.has(choice) ? "1" : "0", TestConstants.QUESTION_RESPONSE_CHOICE_SEPERATOR);
        }
      } else {
        for (let choice = 0; choice < this.question.answers.length; choice++) {
          //          console.log(`QuestionComponent.getResponse.forLoop.singleResponse: choice: ${choice}, selection: ${this.SelectedAnswerIndex}`);
          serializedResponse = serializedResponse.concat((this.SelectedAnswerIndex == choice ? "1" : "0"), TestConstants.QUESTION_RESPONSE_CHOICE_SEPERATOR);
          //          console.log(`serializedResponse: ${serializedResponse}`);
        }
      }

      let questionStatusString = this.questionStatus.toString();

      //      console.log(`question response = ${[this.question?.idQuestion, serializedResponse, questionStatusString].join(TestConstants.QUESTION_STATUS_SEPARATOR)}`);

      let response: QuestionResponse = new QuestionResponse(this.question?.idQuestion, serializedResponse, questionStatusString, this.getQuestionResponseDetails());
      return response;
    } else {
      return new QuestionResponse("", "", "", new ResponseDetails(0, 0, 0, 0));;
    }
  }

  private getQuestionResponseDetails(): IResponseDetails {
    let [answeredCount, answeredPoints, correctCount, correctPoints] = [
      this.questionStatus == TestConstants.QuestionStatus.NOT_ANSWERED ? 0 : 1,
      this.questionStatus == TestConstants.QuestionStatus.NOT_ANSWERED ? 0 : this.pointsPerQuestion,
      this.QuestionIsAnsweredCorrectly ? 1 : 0,
      this.getScore()
    ];
    return new ResponseDetails(answeredCount, answeredPoints, correctCount, correctPoints);
  }


  public getStatCountsTuple(): [number, number, number, number] {
    let [answeredCount, answeredPoints, correctCount, correctPoints] = [
      this.questionStatus == TestConstants.QuestionStatus.NOT_ANSWERED ? 0 : 1,
      this.questionStatus == TestConstants.QuestionStatus.NOT_ANSWERED ? 0 : this.pointsPerQuestion,
      this.QuestionIsAnsweredCorrectly ? 1 : 0,
      this.getScore()
    ];
    return [answeredCount, answeredPoints, correctCount, correctPoints];
  }


  /**
   * Get the Answer Response to Save
   */
  public setResponse(response: string): void {
    // split response into the same 3-5 serialized fields using fields/things to get the serializable response with a seperator between the fields
    // (we are using a QUESTION_STATUS_SEPARATOR and QUESTION_STATUS_SEPARATOR_ESCAPED for this)
    // 1.) QuestionId,
    // 2.) Searialized Selections,
    // 3.) Question Status,
    // 4.) (optionally) Time in seconds to answer,
    // 5.) (optionally) Score

    let [idQuestion, serializedResponse, questionStatusString] = response.split(TestConstants.QUESTION_STATUS_SEPARATOR_ESCAPED);
    //   console.log(`question response = ${[this.question?.idQuestion, serializedResponse, questionStatusString].join(TestConstants.QUESTION_STATUS_SEPARATOR)}`);
    //    return [this.question?.idQuestion, serializedResponse, questionStatusString].join(QuestionComponent.QUESTION_STATUS_SEPARATOR);
  }


  /**
   * Constructor
   * Comments:
   * 1.) 08/19/2022: Has a parameter for creating Dynamic Components.  NOT USING.  WILL DELETE soon
   * @param componentFactoryResolver // Not using it. May not need it 
   * @param gs: GlobalService // provides access to the Window object so as to access associated MatghJax javascript variable
   * @param element: ElementRef // Access to the Question Native element to Typeset any Math on "content Changes"
   */
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public gs: GlobalService,
    private element: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  /**
   * We are having issues when we render a test as a result of a "fetch" operation from the Menu.
   * So, detect changes and invoke the "renderMath" process explicitly.
   * 
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes["question"]) {
      // console.log("content chnaged")
      this.renderMath();
    }
  }

  /**
   * 2022-09-08 6.00PM.  After close to 10 hours of struggle.
   * This method gets a handle on MathJax module, makes sure, its been loaded (this.mathJaxObject.typeset is undefined until we load and configure it.
   * We then simply "typeset" the question "native" component as a whole.
   * 
   * Btw, we still have this happenning in a timer.  Will look into it later.
   * Also, we may be able to move this up to a section or segment or maybe even Testview.  Exausted for now.  Will work on it later.
   */
  renderMath() {
    // console.log("render math")
    this.mathJaxObject = (this.gs.nativeGlobal() as any).MathJax;

    setTimeout(() => {
      if (this.element && typeof (this.mathJaxObject.typeset) == 'function') {
        /*        console.log(`this.questionTextDiv: ${JSON.stringify(this.element.nativeElement.innerHTML)}`);
                console.log(`type of this.mathJaxObject.typeset: ${typeof (this.mathJaxObject.typeset)}`);
        */
        // this.mathJaxObject.typesetClear([this.element.nativeElement]); /* Does not seem necessary */
        this.mathJaxObject.typeset([this.element.nativeElement]);
      }
    }, 10); /* 10 millisecond delay seems sufficient */
  }

  /**
   * Rerender if we need to explicitly invoke from a button on teh question.
   * Not used for now.  However, a very good debugging tool.
   */
  rerenderMath() {
    this.mathJaxObject = (this.gs.nativeGlobal() as any).MathJax;
    if (this.element) {
      console.log(`this.questionTextDiv: ${JSON.stringify(this.element.nativeElement.innerHTML)}`);
      console.log(`type of this.mathJaxObject.typeset: ${typeof (this.mathJaxObject.typeset)}`);
      this.mathJaxObject.typeset([this.element.nativeElement]);
    }
  }



  ngOnInit(): void {
    this.isMultipleAnswers = (this.question?.multipleAnswers != null && this.question?.multipleAnswers);
    this.questionHeading = (this.question?.heading != null && this.question?.heading.trim().length > 0) ? this.question?.heading.trim() : null;
    this.questionsetText = (this.question?.idQuestionset != null && this.question?.questionsetText != null) ? this.question?.questionsetText : null;
    this.questionPrecontext = (this.question?.textPrecontext != null && this.question?.textPrecontext.trim().length > 0) ? this.question?.textPrecontext.trim() : null;
    this.questionPostcontext = (this.question?.textPostcontext != null && this.question?.textPostcontext.trim().length > 0) ? this.question?.textPostcontext.trim() : null;
    if (this.question?.text != null && this.question?.text.trim().length > 0) {
      //      console.log(`Question Text: ${this.question?.text}`)
      this.questionTextArray = this.question?.text.split(QuestionComponent.QUESTION_LINE_DELIMITER);
    } else {
      //      console.log(`Question HAD NO Text: ${this.question}`)
      this.questionTextArray = [];
    }
    if (this.question?.instructions && this.question?.instructions.trim().length > 0) {
      this.questionInstructions = this.question?.instructions.trim();
    } else if (this.defaultQuestionInstructions && this.defaultQuestionInstructions.trim().length > 0) {
      this.questionInstructions = this.defaultQuestionInstructions.trim();
    } else {
      this.questionInstructions = QuestionComponent.MULTIPLE_CHOICE_QUESTION_TYPE_DEFAULT_INSTRUCTIONS;
    }

    // And finally set any Previously stored responses
    // Notice the sequence this happens in:
    // 1.) Deserialize and Set the indexes that show answer selections 
    this.SelectedAnswerIndex = QuestionComponent.DEFAULT_UNANSWERED_ANSWER_INDEX;
    this.SelectedAnswerIndexSet = new Set<number>();

    console.log(`QuestionComponent.questionResponse: ${JSON.stringify(this.questionResponse)}`);
    if (this.questionResponse && this.questionResponse.serializedAnswerResponses != null && this.questionResponse.serializedAnswerResponses.trim().length > 0) {
      let answerArray = this.questionResponse.serializedAnswerResponses.trim().split(TestConstants.QUESTION_RESPONSE_CHOICE_SEPERATOR);
//      console.log(`answerArray[]: ${answerArray}`)
      if (this.isMultipleAnswers) {
        for (let index = 0; index < answerArray.length; index++) {
          if (answerArray[index] == "1") {
            this.SelectedAnswerIndexSet.add(index);
          }
        }
      } else {
        for (let index = 0; index < answerArray.length; index++) {
          if (answerArray[index] == "1") {
            this.SelectedAnswerIndex = index;
            // found the one.  no reason to continue
            break;
          }
        }
      }
    }
    // 2.) Set the Question Statuses
    if (this.questionResponse && this.questionResponse.questionStatus) {

      /*   None of this junk works.  Will use brute force.
            this.questionStatus = this.questionResponse.questionStatus as TestConstants.QuestionStatus;
            let typedClassString: string = this.questionResponse.questionStatus as keyof typeof TestConstants.QuestionStatusHighlightClass;
            this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass[typedClassString];
            this.questionStatusHighlightClass = this.questionResponse.questionStatus as TestConstants.QuestionStatusHighlightClass;
      */
      switch (this.questionResponse.questionStatus) {
        case "CORRECT":
          this.questionStatus = TestConstants.QuestionStatus.CORRECT;
          this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.CORRECT;
          this.QuestionIsAnsweredCorrectly = true;
          break;
        case "WRONG":
          this.questionStatus = TestConstants.QuestionStatus.WRONG;
          this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.WRONG;
          this.QuestionIsAnsweredCorrectly = false;
          break;
        case "ANSWERED":
          this.questionStatus = TestConstants.QuestionStatus.ANSWERED;
          this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.ANSWERED;
          // I would like to leave this.QuestionIsAnsweredCorrectly = null.  However, considering that is the default value,
          // and all I am chaging is something that would render as a CSS class property, Change Detection WILL NOT KICK.
          // I am setting "this.QuestionIsAnsweredCorrectly = false" for now, for questions that are in "answered" state.
          // Dees not seem tobe hurting...
          this.QuestionIsAnsweredCorrectly = false;
          break;
        case "NOT_ANSWERED":
          this.questionStatus = TestConstants.QuestionStatus.NOT_ANSWERED;
          this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.NOT_ANSWERED;
          this.QuestionIsAnsweredCorrectly = null;
          break;
        default:
          break;
      }
    }

    // lock the question if necessary
    if (this.testStatus == TestConstants.TEST_STATUS_ASSIGNED || this.testStatus == TestConstants.TEST_STATUS_STARTED) {
      // block teh answers if necessary - this only happens if we have gone through a grading exercise and changes statuses from "corrections" or "archived" back to "started"
      this.ungradeTest();
    } else {
      this.locked = true;
    }

  }

  /**
   * I may not need these methods created specifically for *ngIfs.  Refactor.
   */
  hasQuestionHeading = () => (this.questionHeading != null && this.questionHeading != "");
  hasQuestionsetText = () => (this.questionsetText != null && this.questionsetText != "");
  hasQuestionPrecontext = () => (this.questionPrecontext != null && this.questionPrecontext != "");
  hasQuestionPostcontext = () => (this.questionPostcontext != null && this.questionPostcontext != "");
  hasQuestionInstructions = () => (this.questionInstructions != null && this.questionInstructions != "");


  /**
   * Answer clicked event.  This function acts differently based on whether the question has multiple "correct answers" or just one correct answer.
   * This is defined by the class instance variable this.isMultipleAnswers - which is nothing but question?.multipleAnswers
   * @param event - The event object that gets me access to the "target" native HTML element.  I may be able to assign it styles....
   * @param clickedquestionanswerindex - Index of teh answr choice clicked (zero based)
   */
  onAnswerClicked(event: any, clickedquestionanswerindex: number): void {
    // Make sure the Question is NOT LOCKED.  If it is, this click event is ignored.
    if (this.locked) {
      return;
    }
    //    console.log(`Answer clicked: ${event.target.innerHTML}`);

    // 1.) First, check if the item allows for multiple "correct answers".  This is viaually depicted with as follows:
    //     a.) if "multiple-answer is true, each answer choice toggles between select and unselect
    //     b.) If multiple-answers is false, each click on a "new" response "unselects" any other selection.  Each click on a "selected" item still toggles it.
    if (this.isMultipleAnswers) {
      // first off, toggle select/unselect if the user clicks on the "each choice".  So if a previously selected item is clicked, it will unselect and viceversa.
      if (this.SelectedAnswerIndexSet.has(clickedquestionanswerindex)) {
        this.SelectedAnswerIndexSet.delete(clickedquestionanswerindex);
      } else {
        this.SelectedAnswerIndexSet.add(clickedquestionanswerindex);
      }
      // Next, mark the QuestionStatus and QuestionStatusHighlightClass attributes to appropriately indicate if a question is in a answered state.
      // This "answered" state - indicated with the QuestionStatusHighlightClass enum value - controls visual display via CSS classes
      if (this.SelectedAnswerIndexSet.size > 0) {
        this.questionStatus = TestConstants.QuestionStatus.ANSWERED;
        this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.ANSWERED;
      } else {
        this.questionStatus = TestConstants.QuestionStatus.NOT_ANSWERED;
        this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.NOT_ANSWERED;
      }
    } else {
      // This does 3 things
      // a.) Unselect other selections if a new answer is selected
      // b.) Toggle select on item if its been previously selected
      // c.) Assign styles to Question to make if answered/unanswered
      if (this.SelectedAnswerIndex == clickedquestionanswerindex) {
        this.SelectedAnswerIndex = QuestionComponent.DEFAULT_UNANSWERED_ANSWER_INDEX;
        this.questionStatus = TestConstants.QuestionStatus.NOT_ANSWERED;;
        this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.NOT_ANSWERED;
      } else {
        this.SelectedAnswerIndex = clickedquestionanswerindex;
        this.questionStatus = TestConstants.QuestionStatus.ANSWERED;
        this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.ANSWERED;
      }
    }

    // 2.) Grade the question immediately.  Note that, this is a complicated and been refactored to its own routine.
    this.gradeQuestion();

    // 3.) If the Question is "Marked for "instantGrade" (coming in as a Input parameter), we will "visually indicate" corrent/wrong statue via CSS
    //     Note that teh actual "grading" already happened in (2.).  This is just assiging styles to visually indicate the results
    //     Note that "this.QuestionIsAnsweredCorrectly" takes 3 states.  Correct, Wrong and Null (to indicate question is NOT ANSWERED)
    if (this.instantGradeMode || this.temporaryInstantGradeStatus) {
      this.renderResults();
    }

    // Emit the answer clicked event for a subscriber (answer panel) to consume
    let testQuestionAnsweredEvent: TestQuestionAnsweredEvent = {
      idTestsegment: '',
      idTestsection: '',
      idQuestion: this.question ? this.question.idQuestion : '',
      questionStatus: this.questionStatus
    };
    console.log(`Question:  Emitting TestQuestionAnsweredEvent: ${JSON.stringify(testQuestionAnsweredEvent)}`);
    this.testQuestionAnsweredEvent.emit(testQuestionAnsweredEvent);
  }

  /*********************************************************************************************************************************************************
   * TESTING RELATED ACTIONS
   *********************************************************************************************************************************************************/
  /**
   * Public method that will be invoked as part of Test Grading process.
   * Note that the determination of right/wrong has already happened as part of answering questions.  This function will simply display results and lock the question.
   */
  public performTestRelatedFunction(action: TestConstants.TestActions) {
    console.log(`QuestionComponent: performTestRelatedFunction() Called! with action: ${action}`);
    switch (action) {
      case TestConstants.TestActions.GRADE:
        this.gradeTest();
        break;
      case TestConstants.TestActions.UNGRADE:
        this.ungradeTest();
        break;
      case TestConstants.TestActions.CONTINUE:
        this.continueTest();
        break;
      case TestConstants.TestActions.RESTART:
        this.restartTest();
        break;
    }
    this.changeDetectorRef.markForCheck();
  }

  /**
   * This Test Method - at an indivisual question level - displays results and locks the question.
   */
  private gradeTest() {
    this.gradeQuestion();
    this.renderResults();
    this.lockQuestion();
  }

  /**
   * This Test Method - at an indivisual question level - resets arswer-selection and unlocks the test.
   * *** Just as a precaution, this only does the deed if do so if the TestQuestion is in a previously locked state. ***
   */
  private restartTest() {
    // Simpley return if question is not locked (meaning the test has not been graded)
    if (!this.locked) {
      return;
    }
    this.temporaryInstantGradeStatus = false;
    this.SelectedAnswerIndex = QuestionComponent.DEFAULT_UNANSWERED_ANSWER_INDEX;
    this.SelectedAnswerIndexSet = new Set<number>();
    this.QuestionIsAnsweredCorrectly = null;
    this.questionStatus = TestConstants.QuestionStatus.NOT_ANSWERED;
    this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.NOT_ANSWERED;
    this.unlockQuestion();
  }

  /**
    * This Test Method - at an indivisual question level - unlocks the test question and tries to restore its previous answered/unanswered display state without corrections. 
    * *** Just as a precaution, this only does the deed if the TestQuestion is in a previously locked state. ***
    */
  private ungradeTest() {
    // Simpley return if question is not locked (meaning the test has not been graded)
/*    if (!this.locked) {
      return;
    }
*/    // ************
    this.temporaryInstantGradeStatus = false;
    this.unlockQuestion();
    this.maskResults();
  }

  /**
    * This Test Method - at an indivisual question level - simply unlocks the test question.  And keeps the displayed result. 
    * *** Just as a precaution, this only does the deed if do so if the TestQuestion is in a previously locked state. ***
    */
  private continueTest() {
    // Simply return if question is not locked (meaning the test has not been graded)
    if (!this.locked) {
      return;
    }
    this.temporaryInstantGradeStatus = true;
    this.unlockQuestion();
  }


  /**
   * Method that performs the atomic action of "Locking" the test question.
   * just set the locked status to true.  That status is used by the clicked event to determine response to click.
   */
  private lockQuestion = () => this.locked = true;

  /**
   * Method that performs the atomic action of "UnLocking" the test question.
   * just set the locked status to false.  That status is used by the clicked event to determine response to click.
   */
  private unlockQuestion = () => this.locked = false;


  /**
   * Method that performs the atomic action of "Displaying" the test question result
   * This function displays results of grading.  
   * Questions can display CORRECT, WRONG, NOT_ANSWERED.  
   */
  private renderResults(): void {
    console.log(`QuestionComponent.Question Status:  ${this.questionStatus}`);
    if (this.QuestionIsAnsweredCorrectly == null) {
      this.questionStatus = TestConstants.QuestionStatus.NOT_ANSWERED;
      this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.NOT_ANSWERED;
    } else if (this.QuestionIsAnsweredCorrectly) {
      this.questionStatus = TestConstants.QuestionStatus.CORRECT;
      this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.CORRECT;
    } else {
      this.questionStatus = TestConstants.QuestionStatus.WRONG;
      this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.WRONG;
    }
  }

  /**
   * Method that performs the atomic action of "Masking" the test question result
   * This function masks results of grading.  
   * Questions can display CORRECT, WRONG, NOT_ANSWERED.  
   */
  private maskResults(): void {
    if (this.QuestionIsAnsweredCorrectly == null) {
      console.log(`QuestionComponent.maskResults: ${this.question?.idQuestion} is being marked as NOT ANSWERED`);
      this.questionStatus = TestConstants.QuestionStatus.NOT_ANSWERED;
      this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.NOT_ANSWERED;
    } else {
      console.log(`QuestionComponent.maskResults: ${this.question?.idQuestion} is being marked as ANSWERED`);
      this.questionStatus = TestConstants.QuestionStatus.ANSWERED;
      this.questionStatusHighlightClass = TestConstants.QuestionStatusHighlightClass.ANSWERED;
    }
  }

  /**
   * gradeQuestion is a refactored method from "onAnswerClicked".  It takes the same inputs for now.  However, does not use them.
   * TODO: This method should be refactored to get rid of input parameters
   * The purpose of this method is to "Grade" a Multiple-Choice question.  "Grade" activity means to assess the right/wrong'ness of the questions response.
   * 
   * @param event
   * @param clickedquestionanswerindex
   */
  private gradeQuestion(): void {
    // Again, this happens differently based on whether the questions is marked multiple "correct answers".
    if (this.isMultipleAnswers) {
      if (this.SelectedAnswerIndexSet.size > 0) {
        // This accounts for the fact that the question is in an "ANSWERED" state.
        // This next IF statement is to get by TypeScript because TypeScript will not allow this: "this.question?.answers.length".  Otherwise I could do the logic in the For loop below
        if (this.question != null && this.question.answers.length > 0) {
          for (let i = 0, answer = this.question.answers[i]; i < this.question.answers.length; i++) {
            if ((answer.correct && this.SelectedAnswerIndexSet.has(i)) || (!answer.correct && !this.SelectedAnswerIndexSet.has(i))) {
              // for every right combination mark the question "correct".
              // a.) Correct if the "answer" is marked "correct" and the User selected it.
              // b.) Correct if the "answer is NOT marked "correct" and the User DID NOT select it.
              this.QuestionIsAnsweredCorrectly = true;
            } else {
              // Wrong otherwise
              // Also, If there is even a "single" wrong answer, mark the question as "Wrong" and BREAK.
              this.QuestionIsAnsweredCorrectly = false;
              break;
            }
          }
        }
      } else {
        // this question is NOT answered.  Make the QuestionIsAnsweredCorrectly to null to indicate "NOT ANSWERED"
        this.QuestionIsAnsweredCorrectly = null;
      }
    } else {
      // make sure the question is answered first
      if (this.SelectedAnswerIndex != QuestionComponent.DEFAULT_UNANSWERED_ANSWER_INDEX) {
        // Now the question is correct, if the SelectedAnswerIndex matches the answer choice that is marked as the right answer on teh question.  wrong otherwise.
        if (this.question?.answers[this.SelectedAnswerIndex].correct) {
          this.QuestionIsAnsweredCorrectly = true;
        } else {
          this.QuestionIsAnsweredCorrectly = false;
        }
      } else {
        // this question is NOT answered
        this.QuestionIsAnsweredCorrectly = null;

      }
    }
  }

  /**
   * This method is used in the template to visually indicate select/unselect toggle selections on an individual answer choice.
   * Note that this is NOT the "clicked" event handler.  This is just a UI convenience method used in the template to add/delete a CSS class
   * @param clickedquestionanswerindex - the answer choice that is being clicked
   */
  isAnswerSelected(clickedquestionanswerindex: number): boolean {
    if (this.isMultipleAnswers) {
      return this.SelectedAnswerIndexSet.has(clickedquestionanswerindex);
    } else {
      return (clickedquestionanswerindex == this.SelectedAnswerIndex);
    }
  }

}
