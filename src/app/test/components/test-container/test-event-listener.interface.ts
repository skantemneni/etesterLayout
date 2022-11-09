import { TestQuestionAnsweredEvent } from "@app/models/TestConstants";
import { TestResponse } from "@app/models/etestermodel";

export interface ITestEventListener {

  /**
   * Any class that implements should override this methid to react to "a" question being answered in the test-taking process.
   * In this case the event comes generally from somewhere in teh "TestView" and is published.  Mark the questionProxy on the Test Answer Panel with question status.  First identify the Testsegment-section and the do the job.
   * @param testQuestionAnsweredEvent - TestQuestionAnsweredEvent comtains the full set of address parameters to identify teh question and of course, the status and any deltas
   */
  onTestQuestionAnsweredEvent(testQuestionAnsweredEvent: TestQuestionAnsweredEvent): void;

  /**
    * This gets called when teh Test is Graded.  As art of teh grading process, a full testResponse is freshly created and published.
    * That same response also get saved to persistant storage.
    * @param testResponse - the new TestResponse
    */
  onTestResponseUpdatedEvent(newTestResponse: TestResponse): void;



}
