import { Question, QuestionResponse } from "@app/models/etestermodel";

export interface IQuestion {

  /**
   * Uses a QuestionResponse parameter to set the responses on the question.  This will be implemented in a suitable fashion based on question type.
   * For a questionType like multiple-choice, this boils down to "selecting/deselecting" the corresponding answer choice(s) that will then be visually rendered with CSS classes
   * @param questionResponseLocal - Question Object
   * @param defaultQuestionInstructionsLocal - Optional.  Any instructions to set as default if the question itself does not have any instructions.
   */
  renderQuestion(questionLocal: Question, defaultQuestionInstructionsLocal?: string): void;

  /**
   * Uses a QuestionResponse parameter to set the responses on the question.  This will be implemented in a suitable fashion based on question type.
   * For a questionType like multiple-choice, this boils down to "selecting/deselecting" the corresponding answer choice(s) that will then be visually rendered with CSS classes
   * @param questionResponseLocal
   */
  renderQuestionResponse(questionResponseLocal: QuestionResponse): void;

  /**
   * Uses the string parameter to set the visual rendering on the Question.
   * Considering there are only 4 statuses - ["CORRECT", "WRONG", "ANSWERED", "NOT_ANSWERED"], perhaps, I will change into an enum later.
   * @param status
   */
  renderQuestionStatus(status: string): void;


  /**
   * Get the Question Response to Save.  This structure can be serialized in JSON.
   * @return QuestionResponse object that can be JSONifyed to store/restore state of the Question - between renderings and/or sessions
   */
  getResponse(): QuestionResponse;


  /**
   * Points Score for this question.
   * Note that this returns a point value based on teh status of teh question (corrent/wrong/unanswered) and expects to use section settings for pointsPerQuestion, negativePointsPerQuestion, unansweredPointsPerQuestion.  
   */
  getScore(): number;

  /**
   * This responds with a tuple with the following 4 values.  So as to be able to be aggregated easily at higher levels of section, segment and test.
   * @return [number, number, number, number] of [answeredCount, answeredPoints, correctCount, correctPoints]
   */
  getStatCountsTuple(): [number, number, number, number];


  /**
   * The purpose of this method is to "Grade".  "Grade" activity means to assess the right/wrong'ness of the questions response.
   */
  gradeQuestion(): void;

  /**
   * Method that performs the atomic action of "Masking" or hiding the test question result
   * Questions display CORRECT, WRONG, NOT_ANSWERED.  will simply show as ANSWERED or NPT_ANSWERED
   */
  maskResults(): void;

  /**
   * Method that performs the atomic action of "Displaying" the test question result - after grading.
   * This function displays results of grading.  
   * Questions can display CORRECT, WRONG, NOT_ANSWERED. 
   */
  renderResults(): void;

    /**
   * Method that performs the atomic action of "Locking" the test question.
   * just set the locked status to true.  That status is used by the clicked event to determine response to click.
   */
  lockQuestion: () => void;

  /**
   * Method that performs the atomic action of "UnLocking" the test question.
   * just set the locked status to false.  That status is used by the clicked event to determine response to click.
   */
  unlockQuestion: () => void;

 }
