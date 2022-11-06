import { Observable } from "rxjs";
import { TestResponse, Testwithresponse } from "@app/models/etestermodel";
import { Usertest } from "@app/models/etestermodel.usertest";

export interface IDataServer {
  /**
   * Get any assigned Usertests for the loggedin user
   * "Note that a user is expected top be in a logged state and teh service already is expected tp have a valid auth token."
   */
  getAllUserTestsforCurrentUser(): Observable<Usertest[]>;


  /**
   * Complete load of usertest (test with response) for Administering on the App
   * "Note that a user is expected top be in a logged state and teh service already is expected tp have a valid auth token."
   * @param userTestId - usertestId is the id of the testinstance associated with the user
   */
  getUserTestData(userTestId: string): Observable<Testwithresponse>;

  /**
   * Save usertest response to the database
   * "Note that a user is expected top be in a logged state and teh service already is expected tp have a valid auth token."
   * @param usertestId - usertestId is the id of the testinstance associated with the user
   * @param testResponse - testResponse JSON serialized as a string
   * @param completed - flag to indicate if it should kickoff workflow to grade the test (grading happens in an async mode)
   */
  saveTestResponse(usertestId: number, testResponse: TestResponse, completed: boolean): void;

}
