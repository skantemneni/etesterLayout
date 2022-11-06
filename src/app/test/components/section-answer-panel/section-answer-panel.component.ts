import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { Question, QuestionResponse, Testsection, TestsectionResponse } from '@app/models/etestermodel';
import { AnswerPanelQuestionButtonClickedEvent } from '@app/models/TestConstants';
import * as TestConstants from '@app/models/TestConstants';

@Component({
  selector: 'app-section-answer-panel',
  templateUrl: './section-answer-panel.component.html',
  styleUrls: ['./section-answer-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionAnswerPanelComponent implements OnInit {

  @Output() answerPanelQuestionButtonClicked = new EventEmitter<AnswerPanelQuestionButtonClickedEvent>();

  @Input() testsegmentIndex: number = 0;
  @Input() testsegmentName: string = "";
  @Input() testsectionIndex: number = 0;
  @Input() testsectionName: string = "";

  @Input() testsection!: Testsection;
  @Input() testsectionResponse?: TestsectionResponse;
  @Input() segmentsectionindex: number = 0;
  @Input() idTestsegment: string = "";
  @Input() idTest: string = "";

//  questionResponseStatusArray?: QuestionResponse[];

  public setTestsectionResponse(testsectionResponse?: TestsectionResponse) {
//    console.log(`BEFORE: ${JSON.stringify(this.testsectionResponse)}`)
    this.testsectionResponse = testsectionResponse;
//    console.log(`AFTER: ${JSON.stringify(this.testsectionResponse)}`)


    //***********************************************************************************
    // This seems essential.  All we are changing is the "status" of each response.  And Status change is manifested as a CSS class,
    // Since all this is changing is CSS, change detection is not being kicked off.
    this.changeDetectorRef.markForCheck();
    //***********************************************************************************
  }


  constructor(private changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit(): void {
  }
/*  ngOnChanges(): void {
    // initialize the this.questionResponseStatusArray first
    if (this.testsection && this.testsection.section.questions) {
      for (let iter_question of this.testsection.section.questions) {
        this.questionResponseStatusArray?.push(new QuestionResponse(iter_question.idQuestion, '', TestConstants.QuestionStatus.NOT_ANSWERED));
      }
    }
    // now overwrite with right status.
    // NOte that I am not matching on idQuestion here.  Taking a short cut to match on size and sequence of responses
    if (this.testsectionResponse && this.testsectionResponse.questionResponses.length) {
      for (let index = 0; index < this.testsection.section.questions.length; index++) {
        if (this.questionResponseStatusArray) {
          this.questionResponseStatusArray[index] = this.testsectionResponse.questionResponses[index];
        }
      }
    }
    // Now log them for kicks
    console.log(`this.questionResponseStatusArray: ${this.questionResponseStatusArray}`)
  }
*/
  answerItemClicked(event: any): void {
    console.log(`answerClicked: ${event}`)
    console.log(`answerClicked: ${JSON.stringify(event)}`)
    console.log(`answerClicked: ${event.target}`)
    console.log(`answerClicked: ${event.target.id}`)
    console.log(`answerClicked: ${JSON.stringify(event.target.innerHTML)}`)
    let answerPanelQuestionButtonClickedEvent: AnswerPanelQuestionButtonClickedEvent = {
      idTestsegment: this.idTestsegment,
      idTestsection: this.testsection.idTestsection,
      idQuestion: event.target.id
    };
    console.log(`AnswerPanelQuestionButtonClickedEvent: ${JSON.stringify(answerPanelQuestionButtonClickedEvent)}`)
    this.answerPanelQuestionButtonClicked.emit(answerPanelQuestionButtonClickedEvent);
  }

  /**
   * Note that I am taking both the Index and teh id here.
   * The right thing may be to filter to find a matching id and then check its status.
   * However, the more performant way might be to simply treverse the questionArray in the testsectionResponse using the inxex - since the responses are expected to be in the same order as the questions.
   * 
   * @param index
   * @param idQuestion
   */
  getQuestionStatusHighlightClass(index: number, idQuestion: string): string {
    if (this.testsectionResponse && this.testsectionResponse.questionResponses[index]) {
        switch (this.testsectionResponse.questionResponses[index].questionStatus) {
        case "CORRECT":
          return TestConstants.QuestionStatusHighlightClass.CORRECT;
        case "WRONG":
          return TestConstants.QuestionStatusHighlightClass.WRONG;
        case "ANSWERED":
          return TestConstants.QuestionStatusHighlightClass.ANSWERED;
        case "NOT_ANSWERED":
          return TestConstants.QuestionStatusHighlightClass.NOT_ANSWERED;
        default:
          return TestConstants.QuestionStatusHighlightClass.NOT_ANSWERED;
      }
    } else {
      return "";
    }
  }

  /**
   * Mark the questionProxy on the Section Answer Panel with question status. 
   * @param testQuestionAnsweredEvent
   */
  renderQuestionStatus(testQuestionAnsweredEvent: TestConstants.TestQuestionAnsweredEvent): void {
    // This is a weird place to be in.  Where the this.testsectionResponse.questionResponses is NOT EQUAL to testsection.sectionQuestions size.
    // This can legally happen when the test does not have any previously stored responses.
    // On im weird case, The question count rendered is more or less than answer panel questionProxy count.
    // Also weird that I am doing it here.  
    if (this.testsectionResponse && this.testsectionResponse.questionResponses) {
      if (this.testsectionResponse.questionResponses.length < this.testsection.section.questions.length) {
        // Weird I am doing it here.
        this.buildTestsectionResponses();
      }
    }

    // Track down the right response on the testsectionResponse.questionResponses[] array and set its questionStatus appropriately
    if (this.testsectionResponse && this.testsectionResponse.questionResponses) {
      for (let index = 0; index < this.testsectionResponse.questionResponses.length; index++) {
        if (this.testsectionResponse.questionResponses[index].idQuestion == testQuestionAnsweredEvent.idQuestion) {
          this.testsectionResponse.questionResponses[index].questionStatus = testQuestionAnsweredEvent.questionStatus;
          break;
        }
      }
      this.changeDetectorRef.markForCheck();
    }
    return;
  }


  /**
   * This is a weird place to be in.  Where the this.testsectionResponse.questionResponses is NOT EQUAL to testsection.sectionQuestions size.
   * This can legally happen when the test does not have any previously stored responses.
   * On in my weird case, The question count rendered "when I previously graded/saved" was less than answer panel questionProxy count.
   */
  private buildTestsectionResponses(): void {
  if (this.testsectionResponse && this.testsectionResponse.questionResponses) {
    let responsesLength = this.testsectionResponse.questionResponses.length;
    let questionsLength = this.testsection.section.questions.length;
    for (let index = responsesLength; index < questionsLength; index++) {
      let iter_question = this.testsection.section.questions[index];
      this.testsectionResponse.questionResponses[index] = new QuestionResponse(iter_question.idQuestion, '', TestConstants.QuestionStatus.NOT_ANSWERED);
    }
  }
}
}

