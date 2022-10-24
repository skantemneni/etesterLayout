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

export interface TestQuestionAnsweredEvent {
  idTestsegment: string;
  idTestsection: string;
  idQuestion: string;
  questionStatus: QuestionStatus;
}



