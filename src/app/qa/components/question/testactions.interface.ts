export interface ITestActions {
  /**
   * This Test Method - at an indivisual question level - displays results and locks the question.
   */
  gradeTest(): void;

  /**
   * This Test Method - at an indivisual question level - resets arswer-selection and unlocks the test.
   * *** Just as a precaution, this only does the deed if do so if the TestQuestion is in a previously locked state. ***
   */
  restartTest(): void;

  /**
    * This Test Method - at an indivisual question level - unlocks the test question and tries to restore its previous answered/unanswered display state without corrections. 
    * *** Just as a precaution, this only does the deed if the TestQuestion is in a previously locked state. ***
    */
  ungradeTest(): void;

  /**
    * This Test Method - at an indivisual question level - simply unlocks the test question.  And keeps the displayed result. 
    * *** Just as a precaution, this only does the deed if do so if the TestQuestion is in a previously locked state. ***
    */
  continueTest(): void;
}
