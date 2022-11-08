import { Component, Input, OnInit } from '@angular/core';
import { ResponseDetails } from '@app/models/etestermodel';
import * as TestConstants from '@app/models/TestConstants';

@Component({
  selector: 'app-stats-display-panel',
  templateUrl: './stats-display-panel.component.html',
  styleUrls: ['./stats-display-panel.component.scss']
})
export class StatsDisplayPanelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  /**
   * Input Variables
   */
  @Input() displayableHeading: string = "Stats";
  @Input() totalQuestionCount = 0;
  @Input() totalPointCount = -1;
  private _responseDetails?: ResponseDetails | undefined = undefined;
  @Input()
  public get responseDetails(): ResponseDetails | undefined {
    return this._responseDetails;
  }
  public set responseDetails(responseDetails: ResponseDetails | undefined) {
    console.log(`StatsDisplayPanelComponent.set responseDetails called with: ${JSON.stringify(responseDetails)}`);
    this._responseDetails = responseDetails;
    this.answeredCount = this._responseDetails?.answeredCount || 0;
    this.answeredPoints = this._responseDetails?.answeredPoints || 0;
    this.correctCount = this._responseDetails?.correctCount || 0;
    this.correctPoints = this._responseDetails?.correctPoints || 0;

    this.displayStatus = "";
  }
  @Input() idTest?: string;
  @Input() idTestsegment?: string;
  @Input() idTestsection?: string;

  /**
   * Local Variables
   */

  answeredCount = 0;
  answeredPoints = 0;
  correctCount = 0;
  correctPoints = 0;
  displayStatus: string = "";

  /**
  * Perform Test related function at thsi level
  * @param action
  */
  public performTestRelatedFunction(action: TestConstants.TestActions) {
    console.log(`StatsDisplayPanelComponent.performTestRelatedFunction called with: ${action}`);
    switch (action) {
      case TestConstants.TestActions.GRADE:
        this.calculateDisplayStatus();
        break;
      case TestConstants.TestActions.UNGRADE:
        if (this.responseDetails) {
          this.responseDetails = new ResponseDetails(this.responseDetails.answeredCount, this.responseDetails.answeredPoints, 0, 0);
        } else {
          this.responseDetails = new ResponseDetails(0, 0, 0, 0);
        }
        break;
      case TestConstants.TestActions.CONTINUE:
        break;
      case TestConstants.TestActions.RESTART:
        // this.responseDetails = new ResponseDetails(answeredCount = 0, answeredPoints = 0, correctCount = 0, correctPoints = 0);
        this.responseDetails = new ResponseDetails(0, 0, 0, 0);
        break;
    }
  }


  private calculateDisplayStatus() {
    let scorePercent: number = (this.correctPoints / (this.totalPointCount || -1)) * 100;
    if (scorePercent < 40) {
      this.displayStatus = "Failed";
    } else {
      this.displayStatus = "????";
    }
  }
}
