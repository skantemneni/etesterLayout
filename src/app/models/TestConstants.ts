export enum QuestionStatus {
  NOT_ANSWERED = "NOT_ANSWERED",
  ANSWERED = "ANSWERED",
  CORRECT = "CORRECT",
  WRONG = "WRONG"
}

export const enum QuestionStatusHighlightClass {
  NOT_ANSWERED = "question-not-answered",
  ANSWERED = "question-answered",
  CORRECT = "question-answered-correct",
  WRONG = "question-answered-wrong"
}

export const enum TestActions {
  GRADE = "grade-test",
  UNGRADE = "ungrade-test",
  CONTINUE = "continue-test",
  RESTART = "restart-test",
  LOCK = "lock-test",
  SAVE = "save-test"
}


// Response save and set related constants
export const TEST_RESPONSE_SECTION_SEPERATOR: string = "||||";
export const TEST_RESPONSE_SECTION_ID_VALUE_SEPERATOR: string = "####";
export const TEST_RESPONSE_SECTION_SPLIT_SEPERATOR: string = "\\|\\|\\|\\|";
export const TEST_RESPONSE_ANSWER_SEPARATOR: string = "$$$$";
export const TEST_RESPONSE_ANSWER_SPLIT_SEPARATOR: string = "\\$\\$\\$\\$";

export const RESPONSE_TOKEN_SEPERATOR: string = "#$#$";
export const RESPONSE_TOKEN_SEPERATOR_ESCAPED: string = "\\#\\$\\#\\$";

export const QUESTION_STATUS_SEPARATOR: string = "---";
export const QUESTION_STATUS_SEPARATOR_ESCAPED: string = "\\-\\-\\-";
export const QUESTION_RESPONSE_CHOICE_SEPERATOR: string = ":";



	// Constants for Test Statuses
export const TEST_STATUS_ASSIGNED = "assigned";
export const TEST_STATUS_STARTED = "started";
export const TEST_STATUS_SUBMITTED = "submitted";
export const TEST_STATUS_CORRECTIONS = "corrections";
export const TEST_STATUS_COMPLETED = "completed";
export const TEST_STATUS_ARCHIVED = "archived";
export const TEST_STATUS_FAILED = "failed";


export interface AnswerPanelQuestionButtonClickedEvent {
  idTestsegment: string;
  idTestsection: string;
  idQuestion: string;
}

/**
 * This interface defines a structure that will be emitted when a "question" get answered in teh eTester Testing Administration ecosystem
 * Members idTestsegment, idTestsection and idQuestion represent the "address" markers of the question.
 * questionStatus - This value represents the the current state of the question - as indicated in the QuestionStatus enumeration.
 * answeredDeltaCount - This is a tricky detail.  This tells the delta caused by the "Question Answerin Event" (click for MultipleChoice).  And hers is the logic it follows:
 *  ---- This should carry a 0 value by default - if this feature is not implemented.
 *  ---- If a question goes from NOT_ANSWERED to ANSWERED/CORRECT/WRONG, we get a +1,
 *  ---- If a question goes from ANSWERED/CORRECT/WRONG to NOT_ANSWERED, we get a -1,
 *  ---- If a question goes from "One choice" to Another, but remains ANSWERED/CORRECT/WRONG, we get a 0.
 *
 * answeredDeltaPoints - This follows the same logic answeredDeltaCount - except it has to do with "PointsPerQuestion" value.  But same calculations for +, - and 0.
 */
export interface TestQuestionAnsweredEvent {
  idTestsegment: string;
  idTestsection: string;
  idQuestion: string;
  questionStatus: QuestionStatus;
  answeredDeltaCount: number;
  answeredDeltaPoints: number;
}



